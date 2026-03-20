import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { isAuthenticated } = useAuth();

  // Serialization queue — ensures cart API calls execute one at a time
  const queueRef = useRef(Promise.resolve());
  // Operation counter — skips stale server responses when newer ops exist
  const latestOpRef = useRef(0);

  // Derive itemCount and totalAmount directly from cart state using useMemo
  const itemCount = useMemo(() => {
    if (cart && cart.items) {
      return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    return 0;
  }, [cart]);

  const totalAmount = useMemo(() => {
    if (cart && cart.items) {
      return cart.items.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity),
        0
      );
    }
    return 0;
  }, [cart]);

  const applyServerCart = (data) => {
    return data ? { ...data, items: [...(data.items || [])] } : null;
  };

  const loadCart = useCallback(async () => {
    const myOp = ++latestOpRef.current;
    try {
      setLoading(true);
      const data = await cartService.getCart();
      // Only apply if no newer operation has started since this loadCart
      if (myOp === latestOpRef.current) {
        setCart(applyServerCart(data));
      }
      setInitialLoadComplete(true);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setInitialLoadComplete(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setInitialLoadComplete(false);
      loadCart();
    } else {
      setCart(null);
      setInitialLoadComplete(false);
    }
  }, [isAuthenticated, loadCart]);

  const addItem = async (productId, quantity = 1, productData = null) => {
    const myOp = ++latestOpRef.current;

    // Immediate optimistic update (always functional form to avoid stale closures)
    setCart(prevCart => {
      if (!prevCart) {
        return {
          items: productData ? [{
            product_id: productId,
            quantity: quantity,
            unit_price: productData.price || 0,
            product: productData
          }] : [],
          user_id: null
        };
      }

      const existingItemIndex = prevCart.items.findIndex(item => item.product_id === productId);

      if (existingItemIndex !== -1) {
        const newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return { ...prevCart, items: newItems };
      } else if (productData) {
        return {
          ...prevCart,
          items: [
            ...prevCart.items,
            {
              product_id: productId,
              quantity: quantity,
              unit_price: productData.price || 0,
              product: productData
            }
          ]
        };
      }

      return prevCart;
    });

    // Queue the API call so mutations execute one at a time
    const operation = queueRef.current.then(async () => {
      try {
        const data = await cartService.addItem(productId, quantity);
        // Only apply server response if no newer operation started
        if (myOp === latestOpRef.current) {
          setCart(applyServerCart(data));
        }
        return data;
      } catch (error) {
        // Rollback on error — fetch fresh cart from server
        if (myOp === latestOpRef.current) {
          try {
            const freshCart = await cartService.getCart();
            setCart(applyServerCart(freshCart));
          } catch (e) {
            console.error('Failed to reload cart:', e);
          }
        }
        console.error('Failed to add item:', error);
        throw error;
      }
    });

    queueRef.current = operation.catch(() => {});
    return operation;
  };

  const updateItem = async (productId, quantity) => {
    const myOp = ++latestOpRef.current;

    // Immediate optimistic update
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      return {
        ...prevCart,
        items: prevCart.items.map(item =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        )
      };
    });

    const operation = queueRef.current.then(async () => {
      try {
        const data = await cartService.updateItem(productId, quantity);
        if (myOp === latestOpRef.current) {
          setCart(applyServerCart(data));
        }
        return data;
      } catch (error) {
        if (myOp === latestOpRef.current) {
          try {
            const freshCart = await cartService.getCart();
            setCart(applyServerCart(freshCart));
          } catch (e) {
            console.error('Failed to reload cart:', e);
          }
        }
        console.error('Failed to update item:', error);
        throw error;
      }
    });

    queueRef.current = operation.catch(() => {});
    return operation;
  };

  const removeItem = async (productId) => {
    const myOp = ++latestOpRef.current;

    // Immediate optimistic update
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      return {
        ...prevCart,
        items: prevCart.items.filter(item => item.product_id !== productId)
      };
    });

    const operation = queueRef.current.then(async () => {
      try {
        const data = await cartService.removeItem(productId);
        if (myOp === latestOpRef.current) {
          setCart(applyServerCart(data));
        }
        return data;
      } catch (error) {
        if (myOp === latestOpRef.current) {
          try {
            const freshCart = await cartService.getCart();
            setCart(applyServerCart(freshCart));
          } catch (e) {
            console.error('Failed to reload cart:', e);
          }
        }
        console.error('Failed to remove item:', error);
        throw error;
      }
    });

    queueRef.current = operation.catch(() => {});
    return operation;
  };

  const clearCart = async () => {
    const myOp = ++latestOpRef.current;

    setCart(prevCart => prevCart ? { ...prevCart, items: [] } : null);

    const operation = queueRef.current.then(async () => {
      try {
        await cartService.clearCart();
        if (myOp === latestOpRef.current) {
          setCart(null);
        }
      } catch (error) {
        if (myOp === latestOpRef.current) {
          try {
            const freshCart = await cartService.getCart();
            setCart(applyServerCart(freshCart));
          } catch (e) {
            console.error('Failed to reload cart:', e);
          }
        }
        console.error('Failed to clear cart:', error);
        throw error;
      }
    });

    queueRef.current = operation.catch(() => {});
    return operation;
  };

  const value = {
    cart,
    loading,
    itemCount,
    totalAmount,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
