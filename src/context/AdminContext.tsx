import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { COMPANY_INFO } from '../data/companyInfo';
import { adminAuth } from '../utils/adminAuth';
import { getRepo, IRepository } from '../lib/db/repository';
import { AppSettings, Client, Delivery, Invoice, Payment, Complaint } from '../lib/db/types';

interface AdminSettings {
  primaryHotline: string;
  secondaryHotline: string;
  officialEmail: string;
  adminNotificationEmail: string;
  announcementText: string;
  isAnnouncementActive: boolean;
}

interface AdminContextType {
  // Legacy compatibility fields
  products: Product[];
  orders: Order[];
  settings: AdminSettings;
  isAdminLoggedIn: boolean;
  loginAdmin: (passcode: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateProductRate: (productId: string, newRate: number) => void;
  toggleProductPriceVisibility: (productId: string) => void;
  toggleProductActive: (productId: string) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;

  // New Super-Admin SaaS state & helpers
  repo: IRepository;
  isLocalMode: boolean;
  refreshKey: number;
  triggerRefresh: () => void;
  impersonatedClientId: string | null;
  setImpersonatedClientId: (id: string | null) => void;
}

const DEFAULT_SETTINGS: AdminSettings = {
  primaryHotline: COMPANY_INFO.hotlines[0].number,
  secondaryHotline: COMPANY_INFO.hotlines[1].number,
  officialEmail: COMPANY_INFO.email,
  adminNotificationEmail: COMPANY_INFO.email,
  announcementText: 'Commercial pre-dawn delivery routes (5:00 AM–8:00 AM) active daily across Dhaka & Chattogram hubs.',
  isAnnouncementActive: true,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return adminAuth.isAuthenticated();
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const [impersonatedClientId, setImpersonatedClientId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('alifood_products_v1');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('alifood_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('alifood_settings_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Track session activity and 30-min timeout
  useEffect(() => {
    const handleUserActivity = () => {
      if (isAdminLoggedIn) {
        adminAuth.touchActivity();
      }
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const interval = setInterval(() => {
      if (isAdminLoggedIn && !adminAuth.isAuthenticated()) {
        setIsAdminLoggedIn(false);
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAdminLoggedIn]);

  const loginAdmin = async (passcode: string): Promise<boolean> => {
    // Zero hardcoded passwords! Uses Web Crypto verification
    const success = await adminAuth.verifyLocalPassword(passcode);
    if (success) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    adminAuth.logout();
    setIsAdminLoggedIn(false);
    setImpersonatedClientId(null);
  };

  const updateProductRate = (productId: string, newRate: number) => {
    setProducts(prev => prev.map(p => (p.id === productId ? { ...p, rate: newRate } : p)));
    getRepo().saveProduct({ id: productId, rate: newRate });
  };

  const toggleProductPriceVisibility = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === productId ? { ...p, priceVisible: !p.priceVisible } : p));
      const target = updated.find(p => p.id === productId);
      if (target) getRepo().saveProduct({ id: productId, priceVisible: target.priceVisible });
      return updated;
    });
  };

  const toggleProductActive = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === productId ? { ...p, active: !p.active } : p));
      const target = updated.find(p => p.id === productId);
      if (target) getRepo().saveProduct({ id: productId, active: target.active });
      return updated;
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    getRepo().saveProduct(updated);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    getRepo().saveProduct(product);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const repo = getRepo();
  const isLocalMode = repo.mode === 'local';

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        settings,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        updateProductRate,
        toggleProductPriceVisibility,
        toggleProductActive,
        updateProduct,
        addProduct,
        addOrder,
        updateOrderStatus,
        updateSettings,
        repo,
        isLocalMode,
        refreshKey,
        triggerRefresh,
        impersonatedClientId,
        setImpersonatedClientId,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
