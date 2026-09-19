import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface AdminSettings {
  primaryHotline: string;
  secondaryHotline: string;
  officialEmail: string;
  adminNotificationEmail: string;
  announcementText: string;
  isAnnouncementActive: boolean;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  settings: AdminSettings;
  isAdminLoggedIn: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  updateProductRate: (productId: string, newRate: number) => void;
  toggleProductPriceVisibility: (productId: string) => void;
  toggleProductActive: (productId: string) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
}

const PRODUCTS_STORAGE_KEY = 'alifood_products_v1';
const ORDERS_STORAGE_KEY = 'alifood_orders_v1';
const SETTINGS_STORAGE_KEY = 'alifood_settings_v1';
const ADMIN_AUTH_KEY = 'alifood_admin_session';

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: "ord-sample-1",
    orderNumber: "AF-2026-000142",
    customerName: "Habibul Alom Ridoy",
    companyName: "Aribah's Kitchen",
    customerType: "Catering",
    phone: "01817-000000",
    whatsapp: "01817-000000",
    email: "procurement@aribahskitchen.com",
    deliveryCity: "Dhaka",
    deliveryArea: "Tejgaon / West Nakhalpara",
    deliveryAddress: "273/3 West Nakhalpara, Tejgaon, Dhaka-1215",
    preferredDate: "2026-09-22",
    preferredTimeSlot: "5:00 AM - 8:00 AM (Pre-dawn Route)",
    specialInstructions: "100% skinless breast fillets, vacuum packed in 5kg master bags for catering line.",
    items: [
      {
        productId: "prod-broiler-breast-boneless",
        productName: "Broiler Breast Meat (Boneless)",
        quantity: 50,
        unit: "Kg",
        unitPrice: 420,
        priceVisible: true,
        subtotal: 21000,
        customNotes: "Zero fat trim, chilled"
      },
      {
        productId: "prod-broiler-drumstick-skinless",
        productName: "Broiler Drum Stick (Skinless)",
        quantity: 40,
        unit: "Kg",
        unitPrice: 330,
        priceVisible: true,
        subtotal: 13200,
        customNotes: "Cleaned and descaled"
      }
    ],
    estimatedTotal: 34200,
    hasQuoteItems: false,
    status: "Processing",
    createdAt: "2026-09-19T06:30:00Z",
    updatedAt: "2026-09-19T07:15:00Z"
  },
  {
    id: "ord-sample-2",
    orderNumber: "AF-2026-000143",
    customerName: "Md Tanjil Hossain",
    companyName: "SHWAPNO (Chattogram)",
    customerType: "Supermarket",
    phone: "01700-000000",
    whatsapp: "01700-000000",
    email: "procurement.ctg@shwapno.com",
    deliveryCity: "Chattogram",
    deliveryArea: "Khulshi / Agrabad",
    deliveryAddress: "Zakir Hossain Road, North Khulshi, Chattogram",
    preferredDate: "2026-09-21",
    preferredTimeSlot: "5:00 AM - 8:00 AM (Pre-dawn Route)",
    specialInstructions: "Commercial wholesale batch for retail chiller displays with temp logs.",
    items: [
      {
        productId: "prod-broiler-skinless",
        productName: "Broiler (Skinless)",
        quantity: 120,
        unit: "Kg",
        unitPrice: 245,
        priceVisible: true,
        subtotal: 29400,
        customNotes: "Standard 8-way curry cut"
      },
      {
        productId: "prod-sonalika-chicken",
        productName: "Sonalika Chicken (Dressed)",
        quantity: 60,
        unit: "Kg",
        unitPrice: 340,
        priceVisible: true,
        subtotal: 20400,
        customNotes: "Sorted 900g-1kg each"
      }
    ],
    estimatedTotal: 49800,
    hasQuoteItems: false,
    status: "Confirmed",
    createdAt: "2026-09-19T14:10:00Z",
    updatedAt: "2026-09-19T15:00:00Z"
  }
];

const DEFAULT_SETTINGS: AdminSettings = {
  primaryHotline: "01319-345501",
  secondaryHotline: "01401-238019",
  officialEmail: "alifood3193@gmail.com",
  adminNotificationEmail: "alifood3193@gmail.com",
  announcementText: "Commercial pre-dawn delivery routes (5:00 AM–8:00 AM) active daily across Dhaka & Chattogram hubs.",
  isAnnouncementActive: true
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const loginAdmin = (passcode: string): boolean => {
    // Default passcodes for demonstration / operational administration
    if (passcode.trim() === 'alifood2026' || passcode.trim() === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updateProductRate = (productId: string, newRate: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, rate: newRate } : p))
    );
  };

  const toggleProductPriceVisibility = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, priceVisible: !p.priceVisible } : p))
    );
  };

  const toggleProductActive = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

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
        updateSettings
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
