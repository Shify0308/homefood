import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChefHat } from 'lucide-react';

const inputStyle = { width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 14px', color: '#ffcca0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' };
const labelStyle = { color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' };

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/foods');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div className="text-center mb-8">
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ChefHat size={32} color="white" />
          </div>
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: '#ff9500aa', marginTop: '8px' }}>Join HomeFood as a customer</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '32px' }}>
          {[['name','Full Name','text'],['email','Email Address','email'],['phone','Phone Number','tel'],['address','Delivery Address','text'],['password','Password','password']].map(([key, label, type]) => (
            <div key={key} className="mb-4">
              <label style={labelStyle}>{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inputStyle} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#ff9500aa', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#ff9500', fontWeight: 600 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '8px', color: '#ff9500aa', fontSize: '0.9rem' }}>
          Are you a seller? <Link to="/seller/register" style={{ color: '#ff9500', fontWeight: 600 }}>Register as Seller</Link>
        </p>
      </div>
    </div>
  );
}

export function SellerRegisterPage() {
  const [form, setForm] = useState({ name: '', businessName: '', type: 'Home Chef', email: '', phone: '', address: '', city: '', fssai: '', password: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(k => formData.append(k, form[k]));
      if (image) formData.append('profileImage', image);
      await axios.post('/api/auth/seller/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Registration submitted! Await admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div className="text-center mb-8">
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ChefHat size={32} color="white" />
          </div>
          <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.8rem', fontWeight: 700 }}>Become a Seller</h1>
        </div>
        <form onSubmit={handleSubmit} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '32px' }}>
          <div className="mb-4">
            <label style={labelStyle}>Seller Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Home Chef', 'Home Baker'].map(t => (
                <button key={t} type="button" onClick={() => setForm({...form, type: t})}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid', borderColor: form.type === t ? '#ff9500' : '#ff6b0033', background: form.type === t ? '#ff6b0022' : 'transparent', color: form.type === t ? '#ff9500' : '#ffcca066', fontWeight: 600, cursor: 'pointer' }}>
                  {t === 'Home Chef' ? '🍳' : '🧁'} {t}
                </button>
              ))}
            </div>
          </div>
          {[['name','Full Name','text'],['businessName','Business Name','text'],['email','Email Address','email'],['phone','Phone Number','tel'],['address','Full Address','text'],['city','City','text'],['fssai','FSSAI Number (Optional)','text'],['password','Password','password']].map(([key, label, type]) => (
            <div key={key} className="mb-4">
              <label style={labelStyle}>{label}</label>
              <input type={type} required={key !== 'fssai'} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inputStyle} />
            </div>
          ))}
          <div className="mb-6">
            <label style={labelStyle}>Profile Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
              style={{ ...inputStyle, padding: '10px 14px', color: '#ff9500aa' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;