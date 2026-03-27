import { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const [navCategories, setNavCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNavCategories();
  }, []);

  const loadNavCategories = async () => {
    try {
      // This will use cache if available and not expired
      const categories = await productService.getNavCategories();
      setNavCategories(categories);
    } catch (error) {
      console.error('Failed to load nav categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNavCategories = async () => {
    try {
      const categories = await productService.getNavCategories(true);
      setNavCategories(categories);
    } catch (error) {
      console.error('Failed to refresh nav categories:', error);
    }
  };

  const value = {
    navCategories,
    loading,
    refreshNavCategories,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
