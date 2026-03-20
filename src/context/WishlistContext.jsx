import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const isWishlisted = (productId) => items.some((i) => i.product_id === productId);

  const toggle = async (productId) => {
    if (!isAuthenticated) return { wishlisted: false, error: 'not_authenticated' };

    const currently = isWishlisted(productId);

    // Optimistic update — flip state immediately so heart responds instantly
    if (currently) {
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
    } else {
      // Add a placeholder so isWishlisted() returns true right away
      setItems((prev) => [...prev, { product_id: productId, id: 'optimistic' }]);
    }

    try {
      if (currently) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        await wishlistService.addToWishlist(productId);
      }
      // Sync real data from server
      await fetchWishlist();
      return { wishlisted: !currently };
    } catch (err) {
      // Revert optimistic update on failure
      await fetchWishlist();
      throw err;  // Re-throw so the caller can show the error
    }
  };

  const remove = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
    } catch { /* ignore */ }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, isWishlisted, toggle, remove, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
