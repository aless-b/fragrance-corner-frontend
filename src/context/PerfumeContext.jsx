import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PERFUMES } from '../data/initialPerfumes';

const PerfumeContext = createContext();

const LOCAL_STORAGE_KEY = 'fragrance_corner_catalog_v2';
const AUTH_KEY = 'fragrance_corner_user_v2';

export const PerfumeProvider = ({ children }) => {
  // Autenticación
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Catálogo de perfumes
  const [perfumes, setPerfumes] = useState(() => {
    const savedCatalog = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCatalog) {
      try {
        return JSON.parse(savedCatalog);
      } catch (e) {
        console.error("Error al cargar desde localStorage", e);
      }
    }
    return INITIAL_PERFUMES;
  });

  // Tab activo ('dashboard' | 'add-product')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Notificaciones Toast
  const [toast, setToast] = useState(null);

  // Sincronizar catálogo con localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(perfumes));
  }, [perfumes]);

  // Sincronizar usuario con localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = (email, password) => {
    const mockUser = {
      name: 'Alexander Vance',
      email: email || 'admin@fragrancecorner.com',
      role: 'Manager Fragrance Corner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };
    setUser(mockUser);
    setActiveTab('dashboard');
    showToast(`¡Bienvenido de nuevo a Fragrance Corner, ${mockUser.name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Sesión cerrada correctamente.', 'info');
  };

  const addPerfume = (newProductData) => {
    const newPerfume = {
      id: `perfume-${Date.now()}`,
      ...newProductData,
      price: parseFloat(newProductData.price) || 0,
      stock: parseInt(newProductData.stock, 10) || 0,
      volume: parseInt(newProductData.volume, 10) || 50,
      rating: newProductData.rating ? parseFloat(newProductData.rating) : 5.0,
      createdAt: new Date().toISOString()
    };

    setPerfumes(prev => [newPerfume, ...prev]);
    showToast(`"${newPerfume.name}" ha sido agregado a Fragrance Corner.`);
    setActiveTab('dashboard');
  };

  const deletePerfume = (id) => {
    const target = perfumes.find(p => p.id === id);
    setPerfumes(prev => prev.filter(p => p.id !== id));
    if (target) {
      showToast(`"${target.name}" ha sido eliminado del catálogo.`, 'warning');
    }
  };

  const restoreInitialData = () => {
    setPerfumes(INITIAL_PERFUMES);
    showToast('Catálogo restablecido a los datos originales.', 'info');
  };

  return (
    <PerfumeContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        perfumes,
        addPerfume,
        deletePerfume,
        restoreInitialData,
        activeTab,
        setActiveTab,
        toast,
        setToast
      }}
    >
      {children}
    </PerfumeContext.Provider>
  );
};

export const usePerfume = () => {
  const context = useContext(PerfumeContext);
  if (!context) {
    throw new Error('usePerfume debe usarse dentro de un PerfumeProvider');
  }
  return context;
};
