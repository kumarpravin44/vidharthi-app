import { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader';

const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoadingState] = useState(false);
  const [loaderText, setLoaderText] = useState('Loading...');

  const setLoading = (value) => {
    if (typeof value === 'boolean') {
      setLoadingState(value);
    } else if (typeof value === 'string') {
      setLoaderText(value);
      setLoadingState(true);
    } else {
      setLoadingState(false);
    }
  };

  const hideLoader = () => {
    setLoadingState(false);
  };

  const value = {
    loading,
    setLoading,
    hideLoader,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {loading && <Loader text={loaderText} />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};