import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'user') fetchCart();
    else setCart({ items: [] });
  }, [user]);

  useEffect(() => {
    setCartCount(cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
  }, [cart]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch (e) { console.error(e); }
  };

  const addToCart = async (foodItemId, quantity = 1) => {
    const { data } = await axios.post('/api/cart/add', { foodItemId, quantity });
    setCart(data.cart);
    return data;
  };

  const updateQuantity = async (foodItemId, quantity) => {
    const { data } = await axios.put('/api/cart/update', { foodItemId, quantity });
    setCart(data.cart);
  };

  const removeFromCart = async (foodItemId) => {
    const { data } = await axios.delete(`/api/cart/remove/${foodItemId}`);
    setCart(data.cart);
  };

  const clearCart = async () => {
    await axios.delete('/api/cart/clear');
    setCart({ items: [] });
  };

  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
