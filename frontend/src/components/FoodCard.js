import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ShoppingCart, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodCard({ item }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role !== 'user') { toast.error('Only customers can add to cart'); return; }
    try {
      await addToCart(item._id);
      toast.success(`${item.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(item.rating));

  return (
    <Link to={`/foods/${item._id}`} className="block group">
      <div style={{ background: 'linear-gradient(145deg, #1e0e02, #2a1205)', border: '1px solid #ff6b0020', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease' }}
        className="hover:shadow-2xl hover:-translate-y-1 hover:border-orange-500/40">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
          />
          <div style={{ background: 'linear-gradient(to top, #1e0e02, transparent)' }} className="absolute inset-0" />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }} className="px-2.5 py-1 rounded-full text-white uppercase">
              {item.category}
            </span>
          </div>
          {/* Type badge */}
          <div className="absolute top-3 right-3">
            <span style={{ background: item.type === 'bakery' ? '#7c3aed22' : '#ff6b0022', border: item.type === 'bakery' ? '1px solid #7c3aed44' : '1px solid #ff6b0044', color: item.type === 'bakery' ? '#c4b5fd' : '#ffcca0', fontSize: '0.65rem' }} className="px-2 py-0.5 rounded-full">
              {item.type === 'bakery' ? '🧁 Baker' : '🍳 Chef'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1rem', fontWeight: 600 }} className="mb-1 line-clamp-1">{item.name}</h3>
          <p style={{ color: '#ff9500aa', fontSize: '0.8rem' }} className="mb-3 line-clamp-2">{item.description}</p>

          {/* Seller */}
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={11} color="#ff6b0077" />
            <span style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{item.sellerName || item.seller?.businessName}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {stars.map((filled, i) => (
                <Star key={i} size={13} fill={filled ? '#ff9500' : 'none'} color={filled ? '#ff9500' : '#ff6b0044'} />
              ))}
              <span style={{ color: '#ff9500aa', fontSize: '0.7rem' }} className="ml-1">({item.totalRatings || 0})</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: '#ff9500aa' }}>
              <Clock size={12} />
              <span style={{ fontSize: '0.75rem' }}>{item.preparationTime} min</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span style={{ color: '#ff9500', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700 }}>₹{item.price}</span>
            </div>
            <button
              onClick={handleAddToCart}
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', boxShadow: '0 4px 15px #ff6b0033' }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium hover:shadow-orange-500/40 hover:scale-105 transition-all"
            >
              <ShoppingCart size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
