import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [pendingWishlistProductIds, setPendingWishlistProductIds] = useState([]);
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
    if (pendingWishlistProductIds.includes(product.id)) return;

    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setPendingWishlistProductIds((prev) => [...prev, product.id]);
    
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
      await fetchWishlist(); // silently sync
    } catch (error) {
      toast.error('Failed to update wishlist');
      await fetchWishlist(); // Revert UI if it failed
    } finally {
      setPendingWishlistProductIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const isWishlistUpdating = (productId) => {
    return pendingWishlistProductIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, isWishlistUpdating }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
