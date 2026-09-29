import React from 'react';
import { PerfumeProvider, usePerfume } from './context/PerfumeContext';
import { useAuthStore } from './store/useAuthStore';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AddProductForm } from './components/AddProductForm';
import { Toast } from './components/Toast';

const MainContent = () => {
  const { activeTab } = usePerfume();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#2D2321] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'add-product' && <AddProductForm />}
      </main>

      <Toast />

      {/* Footer */}
      <footer className="border-t border-[#E8DFD8] bg-[#FAF7F4] py-6 text-center text-xs text-[#85544D]/70 font-medium">
        <p>© 2026 Fragrance Corner. Autenticación protegida vía LDAP + Keycloak OAuth2 JWT.</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PerfumeProvider>
      <MainContent />
    </PerfumeProvider>
  );
}
