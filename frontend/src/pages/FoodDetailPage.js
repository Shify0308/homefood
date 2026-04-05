import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, Clock, MapPin, ShoppingCart, Plus, Minus } from 'lucide-react';

export default function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/foods/${id}`).then(r => { setFood(r.data); setLoading(false); });
    axios.get(`/api/reviews/food/${id}`).then(r => setReviews(r.data));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error('Please login'); return; }
    await addToCart(id, qty);
    toast.success(`Added ${qty}x ${food.name}!`);
  };

  if (loading) return <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#ff9500' }}>Loading...</div></div>;
  if (!food) return <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#ff9500' }}>Food not found</div></div>;

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div style={{ borderRadius: '20px', overflow: 'hidden', height: '400px' }}>
            <img src={food.image} alt={food.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'; }} />
          </div>
          <div>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.75rem', color: 'white', fontWeight: 600, marginBottom: '16px' }}>{food.category}</div>
            <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>{food.name}</h1>
            <p style={{ color: '#ffcca077', lineHeight: 1.7, marginBottom: '20px' }}>{food.description}</p>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9500' }}>
                <Star size={16} fill="#ff9500" /> <span style={{ fontWeight: 600 }}>{food.rating}</span>
                <span style={{ color: '#ff9500aa', fontSize: '0.85rem' }}>({food.totalRatings} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffcca077' }}>
                <Clock size={16} /> {food.preparationTime} min
              </div>
            </div>
            {food.seller && (
              <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '14px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #ff6b0044' }}>
                  <img src={food.seller.profileImage || `https://ui-avatars.com/api/?name=${food.seller.businessName}&background=ff6b00&color=fff`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div style={{ color: '#fff5e6', fontWeight: 600 }}>{food.seller.businessName}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{food.seller.city}</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ color: '#ff9500', fontFamily: "'Georgia', serif", fontSize: '2.2rem', fontWeight: 700 }}>₹{food.price}</span>
            </div>
            {user?.role === 'user' && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '8px 12px' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', color: '#ff9500', cursor: 'pointer' }}><Minus size={16} /></button>
                  <span style={{ color: '#fff5e6', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', color: '#ff9500', cursor: 'pointer' }}><Plus size={16} /></button>
                </div>
                <button onClick={handleAdd} style={{ flex: 1, background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '12px', padding: '14px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 30px #ff6b0044' }}>
                  <ShoppingCart size={18} /> Add to Cart • ₹{food.price * qty}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Reviews */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#ff9500aa' }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#fff5e6', fontWeight: 600 }}>{r.userName || r.user?.name}</span>
                    <div>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#ff9500' : 'none'} color={i < r.rating ? '#ff9500' : '#ff6b0044'} />)}</div>
                  </div>
                  <p style={{ color: '#ffcca077', fontSize: '0.9rem' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
