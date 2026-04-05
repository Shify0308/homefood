import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Package, TrendingUp, Star, Eye, EyeOff } from 'lucide-react';

const inputStyle = { width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '10px', padding: '10px 14px', color: '#ffcca0', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' };
const CATEGORIES = ['Biryani', 'Curry', 'Snacks', 'Desserts', 'Cakes', 'Breads', 'Sweets', 'Beverages', 'Breakfast', 'Lunch', 'Dinner', 'Bakery', 'Other'];

export default function SellerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Biryani', description: '', price: '', preparationTime: '', type: 'food', isAvailable: true });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems(); fetchOrders(); fetchStats();
  }, []);

  const fetchItems = () => axios.get('/api/seller/items').then(r => setItems(r.data));
  const fetchOrders = () => axios.get('/api/seller/orders').then(r => setOrders(r.data));
  const fetchStats = () => axios.get('/api/seller/dashboard').then(r => setStats(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      if (image) fd.append('image', image);
      if (editItem) {
        await axios.put(`/api/seller/update-item/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Item updated!');
      } else {
        await axios.post('/api/seller/add-item', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Item added!');
      }
      setShowAddForm(false); setEditItem(null); setImage(null);
      setForm({ name: '', category: 'Biryani', description: '', price: '', preparationTime: '', type: 'food', isAvailable: true });
      fetchItems(); fetchStats();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await axios.delete(`/api/seller/delete-item/${id}`);
    toast.success('Item deleted'); fetchItems();
  };

  const handleStatusUpdate = async (orderId, status) => {
    await axios.put(`/api/seller/orders/${orderId}/status`, { orderStatus: status });
    toast.success('Status updated'); fetchOrders();
  };

  const startEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, description: item.description, price: item.price, preparationTime: item.preparationTime, type: item.type, isAvailable: item.isAvailable });
    setShowAddForm(true);
  };

  const TABS = [['overview', '📊 Overview'], ['items', '🍽️ My Items'], ['orders', '📦 Orders']];

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '24px 16px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700 }}>{user?.businessName || 'Seller Dashboard'}</h1>
            <p style={{ color: '#ff9500aa' }}>{user?.type} · {user?.city}</p>
          </div>
          {tab === 'items' && (
            <button onClick={() => { setShowAddForm(true); setEditItem(null); setForm({ name: '', category: 'Biryani', description: '', price: '', preparationTime: '', type: 'food', isAvailable: true }); }}
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '12px', padding: '10px 20px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Item
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap', background: tab === key ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : '#1e0a00', color: tab === key ? 'white' : '#ff9500aa', border: tab !== key ? '1px solid #ff6b0022' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                ['Total Items', stats.totalItems || 0, '🍽️', '#ff9500'],
                ['Total Orders', stats.totalOrders || 0, '📦', '#3b82f6'],
                ['Earnings', `₹${stats.totalEarnings || 0}`, '💰', '#22c55e'],
                ['Avg Rating', user?.rating || '0', '⭐', '#f59e0b']
              ].map(([l, v, e, c]) => (
                <div key={l} style={{ background: '#1e0a00', border: `1px solid ${c}22`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{e}</div>
                  <div style={{ color: c, fontFamily: "'Georgia', serif", fontSize: '1.6rem', fontWeight: 700 }}>{v}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>{l}</div>
                </div>
              ))}
            </div>
            {stats.recentOrders?.length > 0 && (
              <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
                <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '16px' }}>Recent Orders</h2>
                {stats.recentOrders.map(o => (
                  <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #ff6b0011' }}>
                    <div>
                      <div style={{ color: '#fff5e6', fontSize: '0.9rem' }}>{o.userName}</div>
                      <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>₹{o.totalAmount}</div>
                    </div>
                    <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: '#ff6b0022', color: '#ff9500' }}>{o.orderStatus}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Items */}
        {tab === 'items' && (
          <div>
            {showAddForm && (
              <div style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '20px' }}>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Item Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} /></div>
                    <div>
                      <label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Price (₹)</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} /></div>
                    <div><label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Prep Time (min)</label><input type="number" required value={form.preparationTime} onChange={e => setForm({...form, preparationTime: e.target.value})} style={inputStyle} /></div>
                    <div>
                      <label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Type</label>
                      <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inputStyle}>
                        <option value="food">🍳 Food (Chef)</option>
                        <option value="bakery">🧁 Bakery (Baker)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Item Image {!editItem && '*'}</label>
                      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required={!editItem} style={{ ...inputStyle, color: '#ff9500aa', padding: '8px 14px' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ color: '#ffcca0', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                      <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '10px', padding: '10px 24px', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button type="button" onClick={() => { setShowAddForm(false); setEditItem(null); }} style={{ background: 'transparent', border: '1px solid #ff6b0033', borderRadius: '10px', padding: '10px 24px', color: '#ff9500aa', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item._id} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ color: '#fff5e6', fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</h3>
                      <span style={{ color: item.isAvailable ? '#22c55e' : '#ef4444', fontSize: '0.75rem' }}>{item.isAvailable ? '● Available' : '● Unavailable'}</span>
                    </div>
                    <div style={{ color: '#ff9500', fontWeight: 700, marginBottom: '8px' }}>₹{item.price}</div>
                    <div style={{ color: '#ff9500aa', fontSize: '0.8rem', marginBottom: '12px' }}>⭐ {item.rating} · {item.preparationTime}min · {item.totalOrders} orders</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(item)} style={{ flex: 1, background: '#ff6b0022', border: '1px solid #ff6b0044', borderRadius: '8px', padding: '8px', color: '#ff9500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}><Edit size={12} /> Edit</button>
                      <button onClick={() => handleDelete(item._id)} style={{ flex: 1, background: '#ff000022', border: '1px solid #ff000044', borderRadius: '8px', padding: '8px', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem' }}><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && <div style={{ textAlign: 'center', padding: '48px', color: '#ff9500aa' }}>No items yet. Add your first item!</div>}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#ff9500aa' }}>No orders yet</div> : orders.map(order => (
              <div key={order._id} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '16px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ color: '#fff5e6', fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>{order.userName} · {order.userPhone}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: '#ff9500', fontWeight: 700 }}>₹{order.totalAmount}</span>
                    <select value={order.orderStatus} onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      style={{ background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '8px', padding: '4px 10px', color: '#ff9500', outline: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>
                      {['placed','confirmed','preparing','ready','out_for_delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ color: '#ffcca077', fontSize: '0.85rem' }}>{order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
                <div style={{ color: '#ff9500aa', fontSize: '0.75rem', marginTop: '8px' }}>📍 {order.userAddress}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
