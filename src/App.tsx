import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomBar } from './components/layout/MobileBottomBar';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderPage } from './pages/OrderPage';
import { AboutPage } from './pages/AboutPage';
import { SupplyPage } from './pages/SupplyPage';
import { PartnersPage } from './pages/PartnersPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  // Client-side pathname router that responds to browser history
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/products':
        return <ProductsPage navigate={navigate} />;
      case '/order':
        return <OrderPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/supply':
        return <SupplyPage navigate={navigate} />;
      case '/partners':
        return <PartnersPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/faq':
        return <FaqPage navigate={navigate} />;
      case '/admin':
        return <AdminPage />;
      default:
        // Match /products/:slug
        if (currentPath.startsWith('/products/')) {
          const slug = currentPath.replace('/products/', '');
          if (slug) {
            return <ProductDetailPage slug={slug} navigate={navigate} />;
          }
        }
        if (currentPath.startsWith('/products')) {
          return <ProductsPage navigate={navigate} />;
        }
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AdminProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 lg:pb-0">
          {/* Main Corporate Header */}
          <Navbar currentPath={currentPath} navigate={navigate} />

          {/* Render Active View */}
          <main className="flex-grow">
            {renderPage()}
          </main>

          {/* Corporate Footer */}
          <Footer navigate={navigate} />

          {/* Mobile Sticky Bottom Action Bar */}
          <MobileBottomBar navigate={navigate} currentPath={currentPath} />
        </div>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
