import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // useNavigate naya import kiya
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Menu, ArrowLeft } from 'lucide-react'; // ArrowLeft icon add kiya

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Back jaane ke liye hook
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LOGIC: Jab bhi user kisi link par click karega, mobile sidebar automatically band ho jayega
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/products': return 'Product Inventory';
      case '/low-stock': return 'Low Stock Alerts';
      case '/recent-updates': return 'Recent Product Updates';
      case '/employees': return 'Employee Management';
      case '/settings': return 'Account Settings';
      case '/billing': return 'Billing / Sales'; // Naye page ka title
      case '/bills': return 'Bill History';      // Naye page ka title
      default: return 'AKRack';
    }
  };

  // Logic: Agar hum Dashboard (/) par hain, toh back button mat dikhao
  const showBackButton = location.pathname !== '/';

  return (
    // 'w-full' aur 'overflow-hidden' lagaya taaki screen bahar na bhage
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden w-full">
      
      {/* 1. Mobile Dark Overlay (Jab sidebar khulega to piche andhera ho jayega) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Container */}
      {/* Mobile (choti screen) par hide rahega, Desktop (lg) par humesha dikhega */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header Menu Bar (Sirf phone par dikhega) */}
        <div className="lg:hidden flex items-center bg-slate-900 dark:bg-slate-950 text-white p-3 shadow-md z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-lg tracking-wide">AKRack App</div>
        </div>

        {/* Existing Navbar (Aapka purana navbar taaki koi functionality na tute) */}
        <Navbar title={getTitle()} />

        {/* Scrollable Page Content */}
        {/* Mobile par padding (p-3) ki hai aur desktop par (lg:p-8) */}
        <main className="flex-1 p-3 lg:p-8 overflow-y-auto w-full flex flex-col">
          
          {/* === NAYA GLOBAL BACK BUTTON === */}
          {showBackButton && (
            <div className="mb-4 flex-shrink-0">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}

          {/* Ye aapke asali page ka content yahan load karega */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};