import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, ShoppingBag, TrendingUp, ChefHat, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [s, u, sel, o, f] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/sellers'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/food-items')
      ]);
      setStats(s.data); setUsers(u.data); setSellers(sel.data); setOrders(o.data); setFoodItems(f.data);
    } catch (e) { toast.error('Failed to load data'); }
  };

  const approveSeller = async (id) => {
    await axios.put(`/api/admin/sellers/${id}/approve`);
    toast.success('Seller approved!'); fetchAll();
  };
  const toggleSeller = async (id) => {
    await axios.put(`/api/admin/sellers/${id}/toggle`);
    toast.success('Updated'); fetchAll();
  };
  const deleteSeller = async (id) => {
    if (!window.confirm('Delete seller?')) return;
    await axios.delete(`/api/admin/sellers/${id}`);
    toast.success('Deleted'); fetchAll();
  };
  const toggleUser = async (id) => {
    await axios.put(`/api/admin/users/${id}/toggle`);
    toast.success('Updated'); fetchAll();
  };
  const deleteUser = async (id) => {
    if (!window.confirm('Delete user?')) return;
    await axios.delete(`/api/admin/users/${id}`);
    toast.success('Deleted'); fetchAll();
  };
  const deleteFoodItem = async (id) => {
    if (!window.confirm('Delete food item?')) return;
    await axios.delete(`/api/admin/food-items/${id}`);
    toast.success('Deleted'); fetchAll();
  };

  const TABS = [['overview','📊 Overview'],['sellers','👨‍🍳 Sellers'],['users','👥 Users'],['orders','📦 Orders'],['foods','🍽️ Food Items']];

  const tableHeader = (cols) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '8px', padding: '10px 16px', background: '#0f0500', borderRadius: '10px', marginBottom: '8px' }}>
      {['Name','Email','Status','Actions'].map(h => <div key={h} style={{ color: '#ff9500aa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>)}
    </div>
  );

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '24px 16px' }}>
      <div className="max-w-7xl mx-auto">
        <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: '#ff9500aa' }}>Full platform control</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap', border: 'none', background: tab === key ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : '#1e0a00', color: tab === key ? 'white' : '#ff9500aa', border: tab !== key ? '1px solid #ff6b0022' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                ['Users', stats.totalUsers, '👥', '#3b82f6'],
                ['Sellers', stats.totalSellers, '👨‍🍳', '#8b5cf6'],
                ['Orders', stats.totalOrders, '📦', '#f59e0b'],
                ['Revenue', `₹${stats.totalRevenue || 0}`, '💰', '#22c55e'],
                ['Pending', stats.pendingSellers, '⏳', '#ef4444'],
              ].map(([l, v, e, c]) => (
                <div key={l} style={{ background: '#1e0a00', border: `1px solid ${c}22`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{e}</div>
                  <div style={{ color: c, fontFamily: "'Georgia', serif", fontSize: '1.5rem', fontWeight: 700 }}>{v || 0}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Pending sellers */}
            {sellers.filter(s => !s.isApproved).length > 0 && (
              <div style={{ background: '#1e0a00', border: '1px solid #f59e0b33', borderRadius: '20px', padding: '24px' }}>
                <h2 style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '16px' }}>⏳ Pending Seller Approvals ({sellers.filter(s => !s.isApproved).length})</h2>
                {sellers.filter(s => !s.isApproved).map(s => (
                  <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0f0500', borderRadius: '12px', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ color: '#fff5e6', fontWeight: 600 }}>{s.businessName}</div>
                      <div style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>{s.type} · {s.city} · {s.email}</div>
                    </div>
                    <button onClick={() => approveSeller(s._id)} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sellers */}
        {tab === 'sellers' && (
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '16px' }}>All Sellers ({sellers.length})</h2>
            {sellers.map(s => (
              <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderBottom: '1px solid #ff6b0011', flexWrap: 'wrap' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #ff6b0033', flexShrink: 0 }}>
                  <img src={s.profileImage || `https://ui-avatars.com/api/?name=${s.businessName}&background=ff6b00&color=fff`} alt="" className="w-full h-full object-cover" />
                </div>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ color: '#fff5e6', fontWeight: 600, fontSize: '0.9rem' }}>{s.businessName}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{s.type} · {s.city} · {s.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {!s.isApproved ? (
                    <span style={{ background: '#f59e0b22', color: '#f59e0b', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>Pending</span>
                  ) : (
                    <span style={{ background: s.isActive ? '#22c55e22' : '#ef444422', color: s.isActive ? '#22c55e' : '#ef4444', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  )}
                  {!s.isApproved && <button onClick={() => approveSeller(s._id)} style={{ background: '#22c55e22', border: '1px solid #22c55e44', borderRadius: '8px', padding: '5px 12px', color: '#22c55e', cursor: 'pointer', fontSize: '0.8rem' }}>Approve</button>}
                  {s.isApproved && <button onClick={() => toggleSeller(s._id)} style={{ background: s.isActive ? '#ef444422' : '#22c55e22', border: `1px solid ${s.isActive ? '#ef444444' : '#22c55e44'}`, borderRadius: '8px', padding: '5px 12px', color: s.isActive ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: '0.8rem' }}>{s.isActive ? 'Deactivate' : 'Activate'}</button>}
                  <button onClick={() => deleteSeller(s._id)} style={{ background: '#ff000022', border: '1px solid #ff000044', borderRadius: '8px', padding: '5px 10px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '16px' }}>All Users ({users.length})</h2>
            {users.map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #ff6b0011', flexWrap: 'wrap' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{u.name?.[0]?.toUpperCase()}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff5e6', fontWeight: 500, fontSize: '0.9rem' }}>{u.name}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{u.email} · {u.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ background: u.isActive ? '#22c55e22' : '#ef444422', color: u.isActive ? '#22c55e' : '#ef4444', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => toggleUser(u._id)} style={{ background: u.isActive ? '#ef444422' : '#22c55e22', border: `1px solid ${u.isActive ? '#ef444444' : '#22c55e44'}`, borderRadius: '8px', padding: '4px 10px', color: u.isActive ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: '0.78rem' }}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => deleteUser(u._id)} style={{ background: '#ff000022', border: '1px solid #ff000044', borderRadius: '8px', padding: '4px 8px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '16px' }}>All Orders ({orders.length})</h2>
            {orders.slice(0, 50).map(o => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #ff6b0011', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ color: '#fff5e6', fontSize: '0.85rem', fontWeight: 500 }}>#{o._id.slice(-8).toUpperCase()}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{o.user?.name || o.userName} · {new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#ff9500', fontWeight: 700, fontSize: '0.9rem' }}>₹{o.totalAmount}</span>
                  <span style={{ background: '#ff6b0022', color: '#ff9500', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>{o.orderStatus}</span>
                  <span style={{ background: o.paymentStatus === 'paid' ? '#22c55e22' : '#f59e0b22', color: o.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' }}>{o.paymentMethod === 'cod' ? 'COD' : o.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Items */}
        {tab === 'foods' && (
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '16px' }}>All Food Items ({foodItems.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems.map(item => (
                <div key={item._id} style={{ background: '#0f0500', border: '1px solid #ff6b0022', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ height: '130px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ color: '#fff5e6', fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                        <div style={{ color: '#ff9500aa', fontSize: '0.75rem' }}>{item.seller?.businessName} · ₹{item.price}</div>
                      </div>
                      <button onClick={() => deleteFoodItem(item._id)} style={{ background: '#ff000022', border: 'none', borderRadius: '8px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
