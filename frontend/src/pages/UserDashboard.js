import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';
import { Package, ShoppingCart, User, Star, Bot } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const [orders, setOrders] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/orders/my-orders').then(r => setOrders(r.data)),
      axios.get('/api/foods?sort=rating').then(r => setRecentFoods(r.data.slice(0, 4)))
    ]).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    placed: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6',
    ready: '#10b981', out_for_delivery: '#ff9500', delivered: '#22c55e', cancelled: '#ef4444'
  };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '24px 16px' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div style={{ background: 'linear-gradient(135deg, #1e0a00, #2d1505)', border: '1px solid #ff6b0033', borderRadius: '24px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '160px', height: '160px', background: 'radial-gradient(circle, #ff6b0015, transparent)', borderRadius: '50%' }} />
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#ff9500aa', marginBottom: '24px' }}>What are you craving today?</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/foods" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', padding: '10px 24px', borderRadius: '12px', color: 'white', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px #ff6b0044' }}>
              🍽️ Browse Menu
            </Link>
            <Link to="/ai-chat" style={{ background: '#1e0a00', border: '1px solid #ff6b0033', padding: '10px 24px', borderRadius: '12px', color: '#ff9500', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} /> AI Suggest
            </Link>
            <Link to="/cart" style={{ background: '#1e0a00', border: '1px solid #ff6b0033', padding: '10px 24px', borderRadius: '12px', color: '#ff9500', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={16} /> Cart ({cartCount})
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            ['Total Orders', orders.length, '📦', '#3b82f6'],
            ['Delivered', orders.filter(o => o.orderStatus === 'delivered').length, '✅', '#22c55e'],
            ['Cart Items', cartCount, '🛒', '#f59e0b'],
            ['Cart Value', `₹${cartTotal}`, '💰', '#ff9500'],
          ].map(([l, v, e, c]) => (
            <div key={l} style={{ background: '#1e0a00', border: `1px solid ${c}22`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{e}</div>
              <div style={{ color: c, fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 700 }}>{v}</div>
              <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700 }}>Recent Orders</h2>
              <Link to="/orders" style={{ color: '#ff9500', fontSize: '0.85rem', textDecoration: 'none' }}>View All →</Link>
            </div>
            {loading ? (
              <div style={{ color: '#ff9500aa', textAlign: 'center', padding: '24px' }}>Loading...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Package size={40} color="#ff6b0044" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#ff9500aa', fontSize: '0.9rem' }}>No orders yet</p>
                <Link to="/foods" style={{ color: '#ff9500', fontSize: '0.85rem' }}>Order now →</Link>
              </div>
            ) : orders.slice(0, 4).map(order => (
              <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0f0500', borderRadius: '12px', marginBottom: '8px' }}>
                <div>
                  <div style={{ color: '#fff5e6', fontSize: '0.85rem', fontWeight: 500 }}>#{order._id.slice(-6).toUpperCase()}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{order.items?.length} items · ₹{order.totalAmount}</div>
                </div>
                <span style={{ background: STATUS_COLORS[order.orderStatus] + '22', color: STATUS_COLORS[order.orderStatus], fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                  {order.orderStatus?.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Profile */}
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>My Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontFamily: "'Georgia', serif", fontSize: '1.6rem', fontWeight: 700 }}>{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div style={{ color: '#fff5e6', fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
                <div style={{ color: '#ff9500aa', fontSize: '0.85rem' }}>{user?.email}</div>
                <div style={{ color: '#ff9500aa', fontSize: '0.85rem' }}>{user?.phone}</div>
              </div>
            </div>
            {user?.address && (
              <div style={{ background: '#0f0500', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ color: '#ff9500aa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Delivery Address</div>
                <div style={{ color: '#ffcca0', fontSize: '0.9rem' }}>{user.address}</div>
              </div>
            )}
            <div style={{ background: '#ff6b0011', border: '1px solid #ff6b0022', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Bot size={20} color="#ff9500" />
              <div>
                <div style={{ color: '#fff5e6', fontSize: '0.85rem', fontWeight: 600 }}>Try AI Food Assistant</div>
                <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>Get personalized food recommendations</div>
              </div>
              <Link to="/ai-chat" style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', padding: '6px 14px', borderRadius: '8px', color: 'white', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Try Now</Link>
            </div>
          </div>
        </div>

        {/* Recommended */}
        {recentFoods.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 700 }}>⭐ Top Rated for You</h2>
              <Link to="/foods" style={{ color: '#ff9500', fontSize: '0.85rem', textDecoration: 'none' }}>See All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentFoods.map(food => <FoodCard key={food._id} item={food} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
