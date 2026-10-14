import React, { useState, useEffect, Suspense } from 'react';
import { AdminProvider } from './context/AdminContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomBar } from './components/layout/MobileBottomBar';

// Public Lightweight Pages (Static import for speed)
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Portals Lazy-Loaded to keep public bundle light
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const ClientPortalPage = React.lazy(() => import('./pages/ClientPortalPage'));
const ClientLoginPage = React.lazy(() => import('./pages/ClientLoginPage'));

export function App() {
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

  // Dynamic document title update per route
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'M/S Ali Food | Wholesale Poultry & Dressed Cuts Partner';
    } else if (currentPath === '/products') {
      document.title = 'What We Supply | M/S Ali Food Wholesale Poultry Catalog';
    } else if (currentPath === '/about') {
      document.title = 'About Us & Hubs | M/S Ali Food Dhaka & Chattogram';
    } else if (currentPath === '/contact') {
      document.title = 'Contact Procurement Desk | M/S Ali Food';
    } else if (currentPath.startsWith('/admin')) {
      document.title = 'Super-Admin Console | M/S Ali Food';
    } else if (currentPath.startsWith('/client')) {
      document.title = 'Client Portal | M/S Ali Food';
    }
  }, [currentPath]);

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/products':
        return <ProductsPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;

      // Client Portal Routes
      case '/client/login':
        return (
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-mono">Loading Client Login...</div>}>
            <ClientLoginPage navigate={navigate} />
          </Suspense>
        );
      case '/client':
        return (
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-mono">Loading Client Portal...</div>}>
            <ClientPortalPage navigate={navigate} />
          </Suspense>
        );

      // Super-Admin Console
      case '/admin':
        return (
          <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-amber-400 font-mono">Loading Super-Admin Console...</div>}>
            <AdminPage />
          </Suspense>
        );

      // Redirects for retired routes
      case '/order':
        return <ProductsPage navigate={navigate} />;
      case '/supply':
      case '/partners':
        return <AboutPage navigate={navigate} />;
      case '/faq':
        return <ContactPage navigate={navigate} />;

      default:
        // Redirect legacy /products/:slug to /products
        if (currentPath.startsWith('/products')) {
          return <ProductsPage navigate={navigate} />;
        }
        return <HomePage navigate={navigate} />;
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');
  const isClientPortalRoute = currentPath === '/client';

  return (
    <AdminProvider>
      {isAdminRoute ? (
        // Dedicated Full-Screen Super-Admin Console
        <main className="min-h-screen bg-slate-950 text-slate-100">
          {renderContent()}
        </main>
      ) : isClientPortalRoute ? (
        // Dedicated Client Portal Workspace
        <main className="min-h-screen bg-slate-50 text-slate-900">
          {renderContent()}
        </main>
      ) : (
        // Public Supplier Website with Corporate Navbar and Footer
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 lg:pb-0">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <main className="flex-grow">
            {renderContent()}
          </main>
          <Footer navigate={navigate} />
          <MobileBottomBar navigate={navigate} currentPath={currentPath} />
        </div>
      )}
    </AdminProvider>
  );
}

export default App;
