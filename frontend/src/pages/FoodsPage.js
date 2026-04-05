import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['All', 'Biryani', 'Curry', 'Snacks', 'Desserts', 'Cakes', 'Breads', 'Sweets', 'Beverages', 'Breakfast', 'Bakery', 'Other'];

export default function FoodsPage() {
  const [searchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sort, setSort] = useState('rating');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchFoods(); }, [search, category, type, sort, minPrice, maxPrice, minRating]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'All') params.set('category', category);
      if (type) params.set('type', type);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      const { data } = await axios.get(`/api/foods?${params}`);
      setFoods(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const clearFilters = () => { setSearch(''); setCategory(''); setType(''); setSort('rating'); setMinPrice(''); setMaxPrice(''); setMinRating(''); };

  const filterStyle = { background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '10px', padding: '10px 12px', color: '#ffcca0', outline: 'none', width: '100%', fontSize: '0.85rem' };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e0a00, #2d1205)', borderBottom: '1px solid #ff6b0022', padding: '32px 16px' }}>
        <div className="max-w-7xl mx-auto">
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Browse All Food</h1>
          {/* Search */}
          <div style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
            <div style={{ flex: 1, display: 'flex', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '10px 16px', gap: '10px', alignItems: 'center' }}>
              <Search size={18} color="#ff9500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food, chef, category..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffcca0', fontSize: '0.95rem' }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '10px 16px', color: '#ff9500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <div style={{ width: '260px', flexShrink: 0, display: showFilters || window.innerWidth > 768 ? 'block' : 'none' }} className="hidden md:block">
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: '#fff5e6', fontWeight: 700 }}>Filters</h3>
              <button onClick={clearFilters} style={{ color: '#ff6b6b', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c === 'All' ? '' : c)}
                    style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', border: '1px solid', background: (category === c || (c === 'All' && !category)) ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : 'transparent', borderColor: (category === c || (c === 'All' && !category)) ? '#ff9500' : '#ff6b0033', color: (category === c || (c === 'All' && !category)) ? 'white' : '#ffcca077' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="mb-5">
              <label style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['', 'All'], ['food', '🍳 Chef'], ['bakery', '🧁 Baker']].map(([val, label]) => (
                  <button key={val} onClick={() => setType(val)}
                    style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', fontSize: '0.78rem', cursor: 'pointer', border: '1px solid', background: type === val ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : 'transparent', borderColor: type === val ? '#ff9500' : '#ff6b0033', color: type === val ? 'white' : '#ffcca077' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ ...filterStyle, width: '50%' }} />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ ...filterStyle, width: '50%' }} />
              </div>
            </div>

            {/* Min Rating */}
            <div className="mb-5">
              <label style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Rating</label>
              <select value={minRating} onChange={e => setMinRating(e.target.value)} style={filterStyle}>
                <option value="">Any rating</option>
                {[3,3.5,4,4.5].map(r => <option key={r} value={r}>⭐ {r}+</option>)}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label style={{ color: '#ff9500', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</label>
              <select value={sort} onChange={e => setSort(e.target.value)} style={filterStyle}>
                <option value="rating">⭐ Top Rated</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="price_asc">💰 Price: Low to High</option>
                <option value="price_desc">💰 Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Grid */}
        <div style={{ flex: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <p style={{ color: '#ff9500aa', fontSize: '0.9rem' }}>
              {loading ? 'Loading...' : `${foods.length} items found`}
            </p>
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '10px', padding: '8px 14px', color: '#ff9500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }} className="md:hidden">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} style={{ background: '#1e0a00', borderRadius: '16px', height: '340px' }} className="animate-pulse" />)}
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map(food => <FoodCard key={food._id} item={food} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍽️</div>
              <p style={{ color: '#ff9500aa', fontSize: '1.1rem', marginBottom: '12px' }}>No items found</p>
              <button onClick={clearFilters} style={{ color: '#ff9500', background: 'none', border: '1px solid #ff9500', borderRadius: '10px', padding: '8px 20px', cursor: 'pointer' }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
