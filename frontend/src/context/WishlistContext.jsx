import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      // Temporarily grab token manually just in case
      const token = localStorage.getItem('token');
      const res = await api.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    const isCurrentlyWishlisted = wishlist.some(item => item.productId === product.id);
    
    // Optimistic UI update and instant toast
    if (isCurrentlyWishlisted) {
      setWishlist(prev => prev.filter(item => item.productId !== product.id));
      toast.success('Removed from your Wishlist');
    } else {
      setWishlist(prev => [{ productId: product.id, product }, ...prev]);
      toast.success('Added to your Wishlist');
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/api/wishlist/toggle', { productId: product.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWishlist(); // silently sync
    } catch (error) {
      toast.error('Failed to update wishlist');
      fetchWishlist(); // Revert UI if it failed
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
