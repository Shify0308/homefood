import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const deliveryFee = 40;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  const handleRemove = async (id, name) => {
    await removeFromCart(id);
    toast.success(`${name} removed`);
  };

  if (!cart.items?.length) {
    return (
      <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <ShoppingBag size={80} color="#ff6b0044" />
        <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.5rem' }}>Your cart is empty</h2>
        <p style={{ color: '#ff9500aa' }}>Explore amazing home-cooked food</p>
        <Link to="/foods" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', padding: '12px 28px', borderRadius: '12px', color: 'white', fontWeight: 600, textDecoration: 'none' }}>Browse Food</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-5xl mx-auto">
        <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '32px' }}>Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div style={{ gridColumn: 'span 2' }}>
            {cart.items.map(item => (
              <div key={item.foodItem} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '16px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff5e6', fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.8rem', marginBottom: '8px' }}>by {item.sellerName}</div>
                  <div style={{ color: '#ff9500', fontWeight: 700 }}>₹{item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuantity(item.foodItem.toString(), item.quantity - 1)} style={{ background: '#ff6b0022', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: '#ff9500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                  <span style={{ color: '#fff5e6', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.foodItem.toString(), item.quantity + 1)} style={{ background: '#ff6b0022', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: '#ff9500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                  <button onClick={() => handleRemove(item.foodItem.toString(), item.name)} style={{ background: '#ff000022', border: 'none', borderRadius: '8px', width: '32px', height: '32px', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}><Trash2 size={14} /></button>
                </div>
                <div style={{ color: '#ff9500', fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px' }}>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
              {[['Subtotal', `₹${cartTotal}`], ['Delivery Fee', `₹${deliveryFee}`], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#ffcca077', fontSize: '0.9rem' }}>{l}</span>
                  <span style={{ color: '#ffcca0', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #ff6b0022', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: '#fff5e6', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#ff9500', fontWeight: 700, fontSize: '1.2rem' }}>₹{total}</span>
              </div>
              <button onClick={() => navigate('/checkout')} style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 8px 30px #ff6b0044' }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
