const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Seller = require('../models/Seller');

// AI Suggestions - works with or without OpenAI key
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query required' });

    const foods = await FoodItem.find({ isActive: true, isAvailable: true })
      .populate('seller', 'businessName city type').limit(100);

    // Rule-based AI if no OpenAI key
    const q = query.toLowerCase();
    let results = [];
    let answer = '';

    if (q.includes('cheap') || q.includes('budget') || q.includes('low price')) {
      results = foods.sort((a, b) => a.price - b.price).slice(0, 5);
      answer = `Here are the most affordable options:\n${results.map(f => `• ${f.name} by ${f.sellerName} — ₹${f.price} (${f.preparationTime} min)`).join('\n')}`;
    } else if (q.includes('best') || q.includes('top rated') || q.includes('highest rating')) {
      results = foods.sort((a, b) => b.rating - a.rating).slice(0, 5);
      answer = `Top rated items:\n${results.map(f => `• ${f.name} ⭐${f.rating} by ${f.sellerName} — ₹${f.price}`).join('\n')}`;
    } else if (q.includes('fast') || q.includes('quick') || q.includes('delivery')) {
      results = foods.sort((a, b) => a.preparationTime - b.preparationTime).slice(0, 5);
      answer = `Fastest preparation times:\n${results.map(f => `• ${f.name} — ${f.preparationTime} min by ${f.sellerName} ₹${f.price}`).join('\n')}`;
    } else if (q.includes('cake') || q.includes('baker') || q.includes('bakery')) {
      results = foods.filter(f => f.type === 'bakery' || f.category === 'Cakes').slice(0, 5);
      answer = results.length > 0
        ? `Top bakery items:\n${results.map(f => `• ${f.name} by ${f.sellerName} — ₹${f.price}`).join('\n')}`
        : 'No bakery items found currently.';
    } else if (q.includes('biryani')) {
      results = foods.filter(f => f.name.toLowerCase().includes('biryani') || f.category === 'Biryani');
      answer = results.length > 0
        ? `Available Biryanis:\n${results.map(f => `• ${f.name} by ${f.sellerName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`
        : 'No biryani available right now.';
    } else {
      // Try OpenAI if key exists
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
        try {
          const { OpenAI } = require('openai');
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const context = foods.slice(0, 50).map(f =>
            `${f.name} (${f.category}) by ${f.sellerName}, ₹${f.price}, ⭐${f.rating}, prep: ${f.preparationTime}min`
          ).join('\n');

          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 300,
            messages: [
              { role: 'system', content: `You are HomeFood AI assistant. Answer food queries using this data:\n${context}\nBe concise, helpful, mention prices and ratings.` },
              { role: 'user', content: query }
            ]
          });
          answer = response.choices[0].message.content;
        } catch (e) {
          answer = generateFallbackAnswer(query, foods);
        }
      } else {
        answer = generateFallbackAnswer(query, foods);
      }
    }

    res.json({ answer, results: results.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateFallbackAnswer(query, foods) {
  if (foods.length === 0) return 'No food items available currently. Check back soon!';
  const top = foods.sort((a, b) => b.rating - a.rating).slice(0, 3);
  return `I recommend these popular items:\n${top.map(f => `• ${f.name} by ${f.sellerName} — ₹${f.price} ⭐${f.rating}`).join('\n')}\n\nYou can also use filters on the menu page to find exactly what you want!`;
}

module.exports = router;
