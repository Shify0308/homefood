import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChefHat, Mail, Lock, Eye, EyeOff, Fingerprint, Shield } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [showSaveBiometric, setShowSaveBiometric] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkBiometricSupport();
    loadSavedCredentials();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      if (window.PublicKeyCredential &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
        setBiometricSupported(true);
      }
    } catch (e) {
      setBiometricSupported(false);
    }
  };

  const loadSavedCredentials = () => {
    try {
      const saved = localStorage.getItem('hf_saved_creds');
      if (saved) {
        const creds = JSON.parse(atob(saved));
        setSavedCredentials(creds);
      }
    } catch (e) {
      localStorage.removeItem('hf_saved_creds');
    }
  };

  const saveCredentials = (emailVal, passwordVal, tabVal) => {
    try {
      const creds = { email: emailVal, password: passwordVal, tab: tabVal };
      localStorage.setItem('hf_saved_creds', btoa(JSON.stringify(creds)));
      setSavedCredentials(creds);
      toast.success('Biometric login enabled for next time!');
    } catch (e) {
      console.error(e);
    }
  };

  const navigateByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'seller') navigate('/seller/dashboard');
    else navigate('/foods');
  };

  const handleBiometricLogin = async () => {
    if (!savedCredentials) {
      toast.error('No saved credentials. Please login manually first.');
      return;
    }
    setBiometricLoading(true);
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname
        }
      });
      if (credential) {
        toast.success('Biometric verified! Logging you in...');
        await performLogin(savedCredentials.email, savedCredentials.password, savedCredentials.tab || 'user', true);
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast.error('Biometric cancelled. Please login manually.');
      } else if (err.name === 'InvalidStateError') {
        toast.error('Biometric not set up. Please login manually first.');
        setBiometricSupported(false);
      } else {
        toast.error('Biometric failed. Please login manually.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const performLogin = async (emailVal, passVal, tabVal, skipBiometricPrompt = false) => {
    setLoading(true);
    try {
      const endpoint = tabVal === 'seller' ? '/api/auth/seller/login' : '/api/auth/login';
      const { data } = await axios.post(endpoint, { email: emailVal, password: passVal });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { role: data.user.role };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await performLogin(email, password, tab);
      if (biometricSupported && !savedCredentials) {
        setPendingRole(result.role);
        setShowSaveBiometric(true);
      } else {
        navigateByRole(result.role);
      }
    } catch (err) {}
  };

  const handleSaveBiometric = async () => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);
      await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'HomeFood', id: window.location.hostname },
          user: { id: userId, name: email, displayName: email },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      });
      saveCredentials(email, password, tab);
      setShowSaveBiometric(false);
      navigateByRole(pendingRole);
    } catch (err) {
      toast.error('Could not enable biometrics. Try again later.');
      setShowSaveBiometric(false);
      navigateByRole(pendingRole);
    }
  };

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
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
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s', background: tab === t ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : 'transparent', color: tab === t ? 'white' : '#ffcca066', border: 'none', cursor: 'pointer' }}>
              {t === 'user' ? '👤 Customer' : '👨‍🍳 Seller'}
            </button>
          ))}
        </div>

        {/* Biometric Login Button */}
        {biometricSupported && savedCredentials && (
          <div style={{ marginBottom: '20px' }}>
            <button onClick={handleBiometricLogin} disabled={biometricLoading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #1e0a00, #2d1505)', border: '2px solid #ff6b0044', borderRadius: '16px', padding: '16px', color: '#ff9500', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1rem', opacity: biometricLoading ? 0.7 : 1, transition: 'all 0.3s' }}>
              <Fingerprint size={28} color="#ff9500" />
              {biometricLoading ? 'Verifying...' : 'Login with Fingerprint / Face ID'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#ff6b0022' }} />
              <span style={{ color: '#ff9500aa', fontSize: '0.85rem' }}>or login manually</span>
              <div style={{ flex: 1, height: '1px', background: '#ff6b0022' }} />
            </div>
          </div>
        )}

        {/* Biometric supported but no saved credentials */}
        {biometricSupported && !savedCredentials && (
          <div style={{ background: '#ff6b0011', border: '1px solid #ff6b0022', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={18} color="#ff9500" />
            <p style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>Your device supports biometric login. Login manually once to enable it.</p>
          </div>
        )}

        {/* Manual Login Form */}
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
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ff9500aa' }}>
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

        {/* Remove saved credentials option */}
        {savedCredentials && (
          <p style={{ textAlign: 'center', marginTop: '12px' }}>
            <button onClick={() => { localStorage.removeItem('hf_saved_creds'); setSavedCredentials(null); toast.success('Biometric login removed'); }}
              style={{ background: 'none', border: 'none', color: '#ff6b0066', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
              Remove biometric login
            </button>
          </p>
        )}
      </div>

      {/* Save Biometric Modal */}
      {showSaveBiometric && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '24px', padding: '40px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', width: '72px', height: '72px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px #ff6b0044' }}>
              <Fingerprint size={36} color="white" />
            </div>
            <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Enable Biometric Login?</h2>
            <p style={{ color: '#ffcca077', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Use your fingerprint or Face ID to login faster next time. Your credentials are stored securely on your device only.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSaveBiometric}
                style={{ flex: 1, background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                Enable
              </button>
              <button onClick={() => { setShowSaveBiometric(false); navigateByRole(pendingRole); }}
                style={{ flex: 1, background: 'transparent', border: '1px solid #ff6b0033', borderRadius: '14px', padding: '14px', color: '#ff9500aa', cursor: 'pointer', fontSize: '0.95rem' }}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}