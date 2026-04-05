import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  'Which chef has the best biryani?',
  'Best cake under ₹500?',
  'Fastest home chef near me?',
  'Top rated home baker?',
  'Cheapest food options?',
  'Suggest good home food'
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '🍽️ Hello! I\'m HomeFood AI. Ask me anything about our chefs, bakers, prices, and ratings. I can help you find the perfect meal!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/ai/suggestions?query=${encodeURIComponent(msg)}`);
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer, results: data.results }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#0f0500', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#1e0a00', borderBottom: '1px solid #ff6b0022', padding: '20px 16px' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-16px">
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px #ff6b0044', marginRight: '16px', flexShrink: 0 }}>
            <Bot size={26} color="white" />
          </div>
          <div>
            <h1 style={{ color: '#fff5e6', fontFamily: "'Georgia', serif", fontSize: '1.3rem', fontWeight: 700 }}>HomeFood AI Assistant</h1>
            <p style={{ color: '#ff9500aa', fontSize: '0.8rem' }}>Ask about chefs, prices, ratings & recommendations</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: '#22c55e22', border: '1px solid #22c55e44', borderRadius: '20px', padding: '4px 12px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
            <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 600 }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#ff9500aa', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Suggested Questions
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '20px', padding: '8px 16px', color: '#ffcca0', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.borderColor = '#ff9500'; e.target.style.color = '#ff9500'; }}
                    onMouseLeave={e => { e.target.style.borderColor = '#ff6b0033'; e.target.style.color = '#ffcca0'; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'assistant' ? 'linear-gradient(135deg, #ff6b00, #ff9500)' : '#1e0a00', border: msg.role === 'user' ? '1px solid #ff6b0033' : 'none' }}>
                {msg.role === 'assistant' ? <Bot size={18} color="white" /> : <User size={18} color="#ff9500" />}
              </div>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ background: msg.role === 'assistant' ? '#1e0a00' : 'linear-gradient(135deg, #ff6b00, #ff9500)', border: msg.role === 'assistant' ? '1px solid #ff6b0022' : 'none', borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 4px 16px 16px', padding: '14px 18px', color: msg.role === 'assistant' ? '#ffcca0' : 'white', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
                {msg.results?.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {msg.results.map(r => (
                      <Link key={r._id} to={`/foods/${r._id}`}
                        style={{ background: '#1e0a00', border: '1px solid #ff6b0033', borderRadius: '10px', padding: '8px 12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={r.image} alt={r.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                        <div>
                          <div style={{ color: '#fff5e6', fontSize: '0.8rem', fontWeight: 600 }}>{r.name}</div>
                          <div style={{ color: '#ff9500', fontSize: '0.75rem' }}>₹{r.price} ⭐{r.rating}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b00, #ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="white" /></div>
              <div style={{ background: '#1e0a00', border: '1px solid #ff6b0022', borderRadius: '4px 16px 16px 16px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', background: '#ff9500', borderRadius: '50%', animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ background: '#1e0a00', borderTop: '1px solid #ff6b0022', padding: '16px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about chefs, prices, ratings..." disabled={loading}
            style={{ flex: 1, background: '#0f0500', border: '1px solid #ff6b0033', borderRadius: '14px', padding: '14px 18px', color: '#ffcca0', outline: 'none', fontSize: '0.95rem' }} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9500)', border: 'none', borderRadius: '14px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px #ff6b0044', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <Send size={20} color="white" />
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
    </div>
  );
}
