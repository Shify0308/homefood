import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = tab === 'seller' ? '/api/auth/seller/login' : '/api/auth/login';
      const { data } = await axios.post(endpoint, { email, password });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'seller') navigate('/seller/dashboard');
      else navigate('/foods');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-8">
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px #ff6b0044' }}>
            <ChefHat size={32} color="white" />
          </div>
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700 }}>Welcome Back</h1>
          <p style={{ color: '#ff9500aa', marginTop: '8px' }}>Sign in to your HomeFood account</p>
        </div>

        {/* Tabs */}
        <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '16px', padding: '6px', marginBottom: '24px', display: 'flex', gap: '6px' }}>
          {['user', 'seller'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s', background: tab === t ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : 'transparent', color: tab === t ? 'white' : '#ffcca066', border: 'none', cursor: 'pointer' }}>
              {t === 'user' ? '👤 Customer' : '👨‍🍳 Seller'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '32px' }}>
          <div className="mb-5">
            <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#ff9500" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                style={{ width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 14px 12px 44px', color: '#ffcca0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div className="mb-6">
            <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#ff9500" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 44px 12px 44px', color: '#ffcca0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ff9500aa' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 30px #ff6b0033', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#ff9500aa', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ff9500', fontWeight: 600 }}>Sign up</Link>
          {tab === 'seller' && <> or <Link to="/seller/register" style={{ color: '#ff9500', fontWeight: 600 }}>Register as Seller</Link></>}
        </p>
      </div>
    </div>
  );
}
