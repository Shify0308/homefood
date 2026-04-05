import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, ChefHat, Bot, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'seller') return '/seller/dashboard';
    return '/dashboard';
  };

  return (
    <nav style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 100%)', borderBottom: '1px solid #ff6b0033' }} className="sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)' }} className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat size={22} color="white" />
          </div>
          <div>
            <span style={{ fontFamily: "'Georgia', serif", color: '#ff9500', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>HomeFood</span>
            <div style={{ color: '#ff660066', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '-2px' }}>Home Chefs & Bakers</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/foods" style={{ color: '#ffcca0' }} className="hover:text-orange-400 transition-colors text-sm font-medium">Browse Menu</Link>
          <Link to="/ai-chat" style={{ color: '#ffcca0' }} className="hover:text-orange-400 transition-colors text-sm font-medium flex items-center gap-1">
            <Bot size={15} /> AI Assistant
          </Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} style={{ color: '#ffcca0' }} className="hover:text-orange-400 transition-colors text-sm font-medium flex items-center gap-1">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              {user.role === 'user' && (
                <Link to="/cart" className="relative">
                  <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)' }} className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingCart size={18} color="white" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
                    )}
                  </div>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div style={{ background: '#ff6b0022', border: '1px solid #ff6b0044' }} className="px-3 py-1.5 rounded-full">
                  <span style={{ color: '#ffcca0', fontSize: '0.8rem' }}>{user.name}</span>
                </div>
                <button onClick={handleLogout} style={{ color: '#ff6b6b' }} className="hover:text-red-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" style={{ color: '#ffcca0', border: '1px solid #ff6b0044' }} className="px-4 py-2 rounded-full text-sm hover:border-orange-400 transition-colors">Login</Link>
              <Link to="/register" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)' }} className="px-4 py-2 rounded-full text-sm text-white font-medium shadow-lg hover:shadow-orange-500/25 transition-shadow">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" style={{ color: '#ff9500' }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#1a0a00', borderTop: '1px solid #ff6b0022' }} className="md:hidden px-4 pb-4 space-y-3">
          <Link to="/foods" onClick={() => setMenuOpen(false)} style={{ color: '#ffcca0' }} className="block py-2 text-sm">Browse Menu</Link>
          <Link to="/ai-chat" onClick={() => setMenuOpen(false)} style={{ color: '#ffcca0' }} className="block py-2 text-sm">AI Assistant</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} style={{ color: '#ffcca0' }} className="block py-2 text-sm">Dashboard</Link>
              {user.role === 'user' && <Link to="/cart" onClick={() => setMenuOpen(false)} style={{ color: '#ffcca0' }} className="block py-2 text-sm">Cart ({cartCount})</Link>}
              <button onClick={handleLogout} style={{ color: '#ff6b6b' }} className="block py-2 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#ffcca0' }} className="block py-2 text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ color: '#ff9500' }} className="block py-2 text-sm">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
