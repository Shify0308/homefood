const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Seller = require('../models/Seller');

router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query required' });

    const foods = await FoodItem.find({ isActive: true, isAvailable: true })
      .populate('seller', 'businessName city type').limit(100);

    const q = query.toLowerCase();
    let results = [];
    let answer = '';

    const searchByName = (keyword) => {
      return foods.filter(f =>
        f.name.toLowerCase().includes(keyword) ||
        f.category.toLowerCase().includes(keyword) ||
        f.description.toLowerCase().includes(keyword)
      );
    };

    if (q.includes('biryani') || q.includes('biriyani') || q.includes('briyani')) {
      results = searchByName('biryani').concat(searchByName('biriyani'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        results = results.sort((a, b) => b.rating - a.rating);
        answer = `Here are the available Biryani options:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating} (${f.preparationTime} min)`).join('\n')}`;
      } else {
        answer = 'Sorry, no biryani is available right now. Check back later!';
      }

    } else if (q.includes('cake') || q.includes('bakery') || q.includes('baker')) {
      results = searchByName('cake').concat(foods.filter(f => f.type === 'bakery'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        results = results.sort((a, b) => b.rating - a.rating);
        answer = `Here are the available Cakes and Bakery items:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no cakes or bakery items available right now!';
      }

    } else if (q.includes('cheap') || q.includes('budget') || q.includes('low price') || q.includes('affordable')) {
      results = [...foods].sort((a, b) => a.price - b.price).slice(0, 5);
      answer = `Here are the most affordable options:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;

    } else if (q.includes('best') || q.includes('top rated') || q.includes('highest rating')) {
      results = [...foods].sort((a, b) => b.rating - a.rating).slice(0, 5);
      answer = `Top rated items right now:\n${results.map(f => `• ${f.name} ⭐${f.rating} by ${f.sellerName || f.seller?.businessName} — ₹${f.price}`).join('\n')}`;

    } else if (q.includes('fast') || q.includes('quick') || q.includes('delivery') || q.includes('fastest')) {
      results = [...foods].sort((a, b) => a.preparationTime - b.preparationTime).slice(0, 5);
      answer = `Fastest preparation times:\n${results.map(f => `• ${f.name} — ${f.preparationTime} min by ${f.sellerName || f.seller?.businessName} ₹${f.price}`).join('\n')}`;

    } else if (q.includes('dosa')) {
      results = searchByName('dosa');
      if (results.length > 0) {
        answer = `Available Dosa options:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no dosa available right now!';
      }

    } else if (q.includes('curry') || q.includes('gravy') || q.includes('masala')) {
      results = searchByName('curry').concat(searchByName('masala')).concat(searchByName('gravy'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        answer = `Available Curry items:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no curry items available right now!';
      }

    } else if (q.includes('snack') || q.includes('starter') || q.includes('appetizer')) {
      results = searchByName('snack').concat(foods.filter(f => f.category === 'Snacks'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        answer = `Available Snacks:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no snacks available right now!';
      }

    } else if (q.includes('sweet') || q.includes('dessert') || q.includes('mithai')) {
      results = searchByName('sweet').concat(searchByName('dessert')).concat(foods.filter(f => f.category === 'Sweets' || f.category === 'Desserts'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        answer = `Available Sweets & Desserts:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no sweets or desserts available right now!';
      }

    } else if (q.includes('breakfast')) {
      results = foods.filter(f => f.category === 'Breakfast').concat(searchByName('breakfast'));
      results = [...new Map(results.map(r => [r._id.toString(), r])).values()];
      if (results.length > 0) {
        answer = `Available Breakfast items:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = 'Sorry, no breakfast items available right now!';
      }

    } else if (q.includes('under') && q.match(/\d+/)) {
      const amount = parseInt(q.match(/\d+/)[0]);
      results = foods.filter(f => f.price <= amount).sort((a, b) => b.rating - a.rating).slice(0, 5);
      if (results.length > 0) {
        answer = `Items under ₹${amount}:\n${results.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
      } else {
        answer = `Sorry, no items found under ₹${amount}!`;
      }

    } else {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
        try {
          const { OpenAI } = require('openai');
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const context = foods.slice(0, 50).map(f =>
            `${f.name} (${f.category}) by ${f.sellerName || f.seller?.businessName}, ₹${f.price}, ⭐${f.rating}, prep: ${f.preparationTime}min`
          ).join('\n');
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 300,
            messages: [
              { role: 'system', content: `You are HomeFood AI assistant. Only suggest items that match what the user is asking about. Available items:\n${context}` },
              { role: 'user', content: query }
            ]
          });
          answer = response.choices[0].message.content;
        } catch (e) {
          answer = searchAndAnswer(query, foods);
        }
      } else {
        answer = searchAndAnswer(query, foods);
      }
    }

    res.json({ answer, results: results.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function searchAndAnswer(query, foods) {
  const q = query.toLowerCase();
  const words = q.split(' ').filter(w => w.length > 2);
  let matched = foods.filter(f =>
    words.some(word =>
      f.name.toLowerCase().includes(word) ||
      f.category.toLowerCase().includes(word) ||
      f.description.toLowerCase().includes(word)
    )
  );
  if (matched.length > 0) {
    matched = matched.sort((a, b) => b.rating - a.rating).slice(0, 5);
    return `Here are items matching your search:\n${matched.map(f => `• ${f.name} by ${f.sellerName || f.seller?.businessName} — ₹${f.price} ⭐${f.rating}`).join('\n')}`;
  }
  return `Sorry, I couldn't find items matching "${query}". Try searching for biryani, cake, dosa, curry, snacks, sweets, or ask for "cheap food" or "top rated"!`;
}

module.exports = router;