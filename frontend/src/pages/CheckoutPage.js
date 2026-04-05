import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CreditCard, Truck, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 40;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  const createOrder = async () => {
    if (!address || !phone) { toast.error('Please fill delivery details'); return; }
    const items = cart.items.map(i => ({
      foodItem: i.foodItem, name: i.name, price: i.price,
      quantity: i.quantity, image: i.image
    }));
    const { data } = await axios.post('/api/orders/create', { items, paymentMethod, deliveryAddress: address, phone });
    return data.order;
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      await createOrder();
      toast.success('Order placed! Pay on delivery.');
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      const { data: rpOrder } = await axios.post('/api/payment/create-order', { amount: total, orderId: order._id });

      const options = {
        key: rpOrder.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: rpOrder.amount,
        currency: 'INR',
        name: 'HomeFood',
        description: 'Home-cooked food order',
        order_id: rpOrder.orderId,
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id
            });
            toast.success('Payment successful! Order confirmed.');
            navigate('/orders');
          } catch (e) { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name, email: user?.email, contact: phone },
        theme: { color: '#ff6b00' },
        modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) }
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        toast.error('Razorpay not loaded. Check your internet connection.');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to initiate payment'); }
    finally { setLoading(false); }
  };

  if (!cart.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-5xl mx-auto">
        <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '32px' }}>Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div style={{ gridColumn: 'span 2' }}>
            {/* Delivery Details */}
            <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={20} color="#ff9500" /> Delivery Details</h2>
              <div className="mb-4">
                <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number"
                  style={{ width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 14px', color: '#ffcca0', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Delivery Address</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="Full delivery address"
                  style={{ width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 14px', color: '#ffcca0', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px' }}>
              <h2 style={{ color: '#fff5e6', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={20} color="#ff9500" /> Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'razorpay', label: 'Online Payment', icon: '💳', desc: 'UPI, Card, Netbanking, Wallets' }
                ].map(m => (
                  <div key={m.value} onClick={() => setPaymentMethod(m.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', border: '1px solid', borderColor: paymentMethod === m.value ? '#ff9500' : '#ff6b0033', background: paymentMethod === m.value ? '#ff6b0015' : 'transparent', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ff6b0022', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{m.icon}</div>
                    <div>
                      <div style={{ color: '#fff5e6', fontWeight: 600 }}>{m.label}</div>
                      <div style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>{m.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: paymentMethod === m.value ? '#ff9500' : '#ff6b0044', background: paymentMethod === m.value ? '#ff9500' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === m.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px' }}>
              <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
              {cart.items.map(i => (
                <div key={i.foodItem} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#ffcca077', fontSize: '0.85rem' }}>{i.name} x{i.quantity}</span>
                  <span style={{ color: '#ffcca0', fontSize: '0.85rem' }}>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #ff6b0022', paddingTop: '12px', marginTop: '12px' }}>
                {[['Subtotal', cartTotal], ['Delivery', deliveryFee], ['Tax', tax]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#ffcca077', fontSize: '0.85rem' }}>{l}</span>
                    <span style={{ color: '#ffcca0', fontSize: '0.85rem' }}>₹{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #ff6b0022', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ color: '#fff5e6', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#ff9500', fontWeight: 700, fontSize: '1.2rem' }}>₹{total}</span>
              </div>
              <button
                onClick={paymentMethod === 'cod' ? handleCOD : handleRazorpay}
                disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', padding: '14px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 8px 30px #ff6b0044', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : paymentMethod === 'cod' ? '🚚 Place Order (COD)' : '💳 Pay ₹' + total}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
