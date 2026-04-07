import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { ChefHat, Star, Truck, Search, ArrowRight, Bot } from 'lucide-react';

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [bakers, setBakers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, chefsRes, bakersRes] = await Promise.all([
        axios.get('/api/foods?sort=rating&limit=8'),
        axios.get('/api/foods/sellers/chefs'),
        axios.get('/api/foods/sellers/bakers')
      ]);
      setFoods(foodsRes.data.slice(0, 8));
      setChefs(chefsRes.data.slice(0, 6));
      setBakers(bakersRes.data.slice(0, 6));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const categories = [
    { name: 'Biryani', emoji: '🍚', color: '#ff6b00' },
    { name: 'Curry', emoji: '🍛', color: '#ff9500' },
    { name: 'Cakes', emoji: '🎂', color: '#ec4899' },
    { name: 'Snacks', emoji: '🥨', color: '#10b981' },
    { name: 'Sweets', emoji: '🍬', color: '#8b5cf6' },
    { name: 'Breads', emoji: '🍞', color: '#f59e0b' },
    { name: 'Beverages', emoji: '☕', color: '#6b7280' },
    { name: 'Desserts', emoji: '🍮', color: '#ef4444' },
  ];

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f0500 0%, #1e0a00 50%, #0f0500 100%)', position: 'relative', overflow: 'hidden' }} className="py-20 px-4">
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, #ff6b0015, transparent)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, #ff950010, transparent)', borderRadius: '50%' }} />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div style={{ display: 'inline-block', background: '#ff6b0015', border: '1px solid #ff6b0033', borderRadius: '50px', padding: '6px 16px', marginBottom: '24px' }}>
            <span style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em' }}>🏠 ORDER FROM HOME CHEFS & BAKERS</span>
          </div>
          <h1 style={{ fontFamily: "'Georgia', serif", color: '#fff5e6', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px' }}>
            Taste the Love of<br />
            <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Home-Cooked Food
            </span>
          </h1>
          <p style={{ color: '#ffcca077', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Connect with talented home chefs and bakers in your city. Fresh, authentic, made with love.
          </p>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto 48px', background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '16px', padding: '8px 8px 8px 20px' }}>
            <Search size={20} color="#ff9500" style={{ alignSelf: 'center', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search biryani, cakes, snacks..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffcca0', fontSize: '1rem' }}
              onKeyDown={e => e.key === 'Enter' && window.location.assign(`/foods?search=${search}`)} />
            <Link to={`/foods?search=${search}`} style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', borderRadius: '10px', padding: '10px 24px', color: 'white', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Search
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {[['500+', 'Home Chefs'], ['1000+', 'Dishes'], ['50K+', 'Happy Customers'], ['4.8★', 'Avg Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div style={{ color: '#ff9500', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700 }}>{num}</div>
                <div style={{ color: '#ffcca055', fontSize: '0.8rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Browse by Category</h2>
          <p style={{ color: '#ff9500aa', textAlign: 'center', marginBottom: '40px' }}>Find exactly what you're craving</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} to={`/foods?category=${cat.name}`}
                style={{ background: '#1e0a00', border: `1px solid ${cat.color}22`, borderRadius: '16px', padding: '16px 8px', textAlign: 'center', transition: 'all 0.3s', textDecoration: 'none' }}
                className="hover:-translate-y-1 hover:shadow-lg group">
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{cat.emoji}</div>
                <div style={{ color: '#ffcca0', fontSize: '0.75rem', fontWeight: 500 }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-16 px-4" style={{ background: '#0a0300' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Top Rated Dishes</h2>
              <p style={{ color: '#ff9500aa' }}>Handpicked by our food experts</p>
            </div>
            <Link to="/foods" style={{ color: '#ff9500', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#1e0a00', borderRadius: '16px', height: '340px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {foods.map(food => <FoodCard key={food._id} item={food} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p style={{ color: '#ff9500aa', fontSize: '1.1rem' }}>No food items yet. Be the first seller to join!</p>
              <Link to="/seller/register" style={{ color: '#ff9500', display: 'inline-block', marginTop: '16px' }}>Register as Seller →</Link>
            </div>
          )}
        </div>
      </section>

      {/* AI Feature Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div style={{ background: 'linear-gradient(135deg, #1e0a00, #2d1505)', border: '1px solid #ff6b0033', borderRadius: '24px', padding: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ background: '#ff6b0022', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Bot size={32} color="#ff9500" />
              </div>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>AI Food Assistant 🤖</h2>
              <p style={{ color: '#ffcca077', marginBottom: '24px', lineHeight: 1.6 }}>
                Ask our AI anything — "Best biryani under ₹200", "Fastest home chef near me", "Top rated baker for wedding cakes".
              </p>
              <Link to="/ai-chat" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', padding: '12px 28px', borderRadius: '12px', color: 'white', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} /> Try AI Assistant
              </Link>
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              {['"Which chef has best biryani?"', '"Cheapest cake under ₹500?"', '"Fastest delivery home chef?"', '"Top rated home baker today?"'].map((q, i) => (
                <div key={i} style={{ background: '#0f0500', border: '1px solid #ff6b0022', borderRadius: '12px', padding: '12px 16px', marginBottom: '10px', color: '#ffcca0', fontSize: '0.9rem' }}>
                  💬 {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Home Chefs */}
      {chefs.length > 0 && (
        <section className="py-16 px-4" style={{ background: '#0a0300' }}>
          <div className="max-w-7xl mx-auto">
            <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Top Home Chefs</h2>
            <p style={{ color: '#ff9500aa', textAlign: 'center', marginBottom: '40px' }}>Verified home chefs in your city</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {chefs.map(chef => (
                <Link key={chef._id} to={`/foods?seller=${chef._id}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '16px', padding: '20px 12px', transition: 'all 0.3s' }} className="hover:-translate-y-1">
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '2px solid #ff6b0044' }}>
                      <img src={chef.profileImage || `https://ui-avatars.com/api/?name=${chef.businessName}&background=ff6b00&color=fff`} alt={chef.businessName} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ color: '#fff5e6', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{chef.businessName}</div>
                    <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{chef.city}</div>
                    {chef.rating > 0 && <div style={{ color: '#ff9500', fontSize: '0.75rem', marginTop: '4px' }}>⭐ {chef.rating}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Home Bakers */}
      {bakers.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Top Home Bakers</h2>
            <p style={{ color: '#ff9500aa', textAlign: 'center', marginBottom: '40px' }}>Verified home bakers in your city</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {bakers.map(baker => (
                <Link key={baker._id} to={`/foods?seller=${baker._id}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
                  <div style={{ background: '#1e0a00', border: '1px solid #ff950033', borderRadius: '16px', padding: '20px 12px', transition: 'all 0.3s' }} className="hover:-translate-y-1">
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '2px solid #ff950044' }}>
                      <img src={baker.profileImage || `https://ui-avatars.com/api/?name=${baker.businessName}&background=ff9500&color=fff`} alt={baker.businessName} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ color: '#fff5e6', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{baker.businessName}</div>
                    <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{baker.city}</div>
                    {baker.rating > 0 && <div style={{ color: '#ff9500', fontSize: '0.75rem', marginTop: '4px' }}>⭐ {baker.rating}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4" style={{ background: '#0a0300' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ChefHat size={32} />, title: 'Verified Home Chefs', desc: 'Every chef is vetted and approved by our admin team. Quality guaranteed.' },
              { icon: <Star size={32} />, title: 'Real Reviews', desc: 'Honest ratings from verified customers. Know what you\'re ordering.' },
              { icon: <Truck size={32} />, title: 'Fast Delivery', desc: 'Fresh food from nearby home chefs. Delivered hot and on time.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
                <div style={{ color: '#ff9500', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                <h3 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#ffcca066', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1e0a00, #2d1505)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Are you a Home Chef or Baker?</h2>
          <p style={{ color: '#ffcca077', marginBottom: '32px' }}>Join hundreds of home chefs earning money doing what they love.</p>
          <Link to="/seller/register" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', padding: '14px 36px', borderRadius: '14px', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', boxShadow: '0 8px 30px #ff6b0044' }}>
            Start Selling Today →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0300', borderTop: '1px solid #ff6b0015', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ color: '#ff9500', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>🍽️ HomeFood</div>
        <p style={{ color: '#ff6b0055', fontSize: '0.85rem' }}>Connecting home chefs and bakers with food lovers. Made with ❤️</p>
      </footer>

    </div>
  );
}