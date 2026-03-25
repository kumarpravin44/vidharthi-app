import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAppSettings } from '../services/settingsService';

const AppSettingsContext = createContext(null);

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    store_name: "",
    store_phone: null,
    store_email: null,
    store_address: null,
    delivery_charge_single: 10,
    delivery_charge_multiple: 15,
    delivery_charge_tiers: null,
    veg_order_start_hour: 5,
    veg_order_end_hour: 9,
    veg_order_enabled: true,
    maintenance_mode: false,
    maintenance_message: "",
  });
  const [loaded, setLoaded] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const data = await getAppSettings();
      setSettings(data);
    } catch {
      // Keep defaults on failure
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <AppSettingsContext.Provider value={{ settings, loaded, refreshSettings: loadSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be inside AppSettingsProvider");
  return ctx;
};
