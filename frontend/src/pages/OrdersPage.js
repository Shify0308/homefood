import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  placed: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6',
  ready: '#10b981', out_for_delivery: '#ff9500', delivered: '#22c55e', cancelled: '#ef4444'
};
const STATUS_LABELS = {
  placed: '📦 Order Placed', confirmed: '✅ Confirmed', preparing: '👨‍🍳 Preparing',
  ready: '✨ Ready', out_for_delivery: '🚴 Out for Delivery', delivered: '🎉 Delivered', cancelled: '❌ Cancelled'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = () => {
    axios.get('/api/orders/my-orders').then(r => { setOrders(r.data); setLoading(false); });
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      await axios.post('/api/reviews/add', {
        foodItemId: reviewModal.foodItemId,
        sellerId: reviewModal.sellerId,
        orderId: reviewModal.orderId,
        rating,
        comment
      });
      toast.success('Review submitted!');
      setReviewModal(null);
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#ff9500' }}>Loading orders...</div>
    </div>
  );

  if (!orders.length) return (
    <div style={{ background: '#0f0500', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <Package size={80} color="#ff6b0044" />
      <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.5rem' }}>No orders yet</h2>
      <p style={{ color: '#ff9500aa' }}>Your order history will appear here</p>
    </div>
  );

  return (
    <div style={{ background: '#0f0500', minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-3xl mx-auto">
        <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '32px' }}>My Orders</h1>

        {orders.map(order => (
          <div key={order._id} style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ color: '#ff9500aa', fontSize: '0.8rem', marginBottom: '4px' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                <div style={{ color: '#ffcca077', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: STATUS_COLORS[order.orderStatus] + '22', border: `1px solid ${STATUS_COLORS[order.orderStatus]}44`, color: STATUS_COLORS[order.orderStatus], fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                  {STATUS_LABELS[order.orderStatus]}
                </span>
                <span style={{ background: order.paymentStatus === 'paid' ? '#22c55e22' : '#f59e0b22', border: `1px solid ${order.paymentStatus === 'paid' ? '#22c55e44' : '#f59e0b44'}`, color: order.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}>
                  {order.paymentMethod === 'cod' ? 'COD' : 'Paid'}
                </span>
                {order.orderStatus === 'placed' && (
                  <button onClick={() => cancelOrder(order._id)}
                    style={{ background: '#ef444422', border: '1px solid #ef444444', borderRadius: '20px', padding: '4px 12px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>

            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff5e6', fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>x{item.quantity} • ₹{item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#ff9500', fontWeight: 600 }}>₹{item.price * item.quantity}</div>
                  {order.orderStatus === 'delivered' && (
                    <button onClick={() => setReviewModal({ foodItemId: item.foodItem, sellerId: item.seller, orderId: order._id, itemName: item.name })}
                      style={{ background: '#ff9500', border: 'none', borderRadius: '20px', padding: '4px 10px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} /> Review
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #ff6b0022', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ffcca077', fontSize: '0.9rem' }}>Total Amount</span>
              <span style={{ color: '#ff9500', fontWeight: 700, fontSize: '1.1rem' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}>
            <h2 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Rate & Review</h2>
            <p style={{ color: '#ff9500aa', fontSize: '0.9rem', marginBottom: '24px' }}>{reviewModal.itemName}</p>

            {/* Star Rating */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '10px' }}>Your Rating</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Star size={32} fill={star <= rating ? '#ff9500' : 'none'} color={star <= rating ? '#ff9500' : '#ff6b0044'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#ffcca0', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Your Review</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
                placeholder="Share your experience..."
                style={{ width: '100%', background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px 14px', color: '#ffcca0', outline: 'none', resize: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={submitReview} disabled={submitting}
                style={{ flex: 1, background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '12px', padding: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button onClick={() => setReviewModal(null)}
                style={{ flex: 1, background: 'transparent', border: '1px solid #ff6b0033', borderRadius: '12px', padding: '12px', color: '#ff9500aa', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}