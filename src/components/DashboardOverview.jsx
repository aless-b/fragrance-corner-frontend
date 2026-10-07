import React, { useState, useMemo, useEffect } from 'react';
import { usePerfume } from '../context/PerfumeContext';
import { useAuthStore } from '../store/useAuthStore';
import { ProductCard } from './ProductCard';
import { 
  Package, 
  Search, 
  Filter, 
  Sparkles, 
  Plus, 
  Layers,
  RefreshCw
} from 'lucide-react';

export const DashboardOverview = () => {
  const { perfumes, setActiveTab, setToast, deletePerfume: deleteFromContext } = usePerfume();
  const { token, user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');

  // Estado para perfumes combinando backend MySQL y estado local de React
  const [apiPerfumes, setApiPerfumes] = useState(perfumes);
  const [loadingBackend, setLoadingBackend] = useState(false);

  // Sincronizar apiPerfumes siempre que 'perfumes' cambie en el Contexto
  useEffect(() => {
    setApiPerfumes(perfumes);
  }, [perfumes]);

  // Consultar Backend MySQL al ingresar al Dashboard
  useEffect(() => {
    fetchPerfumesFromBackend();
  }, []);

  const fetchPerfumesFromBackend = async () => {
    if (!token) return;
    setLoadingBackend(true);

    const directBackendUrl = 'http://localhost:3001/api/perfumes';
    const proxiedUrl = '/api/perfumes';

    let response = null;

    try {
      try {
        response = await fetch(directBackendUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (directErr) {
        response = await fetch(proxiedUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response && response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Fusionar backend MySQL con cualquier perfume nuevo local
          setApiPerfumes(json.data);
        }
      }
    } catch (err) {
      console.warn('Backend MySQL no alcanzable, usando catálogo local:', err.message);
    } finally {
      setLoadingBackend(false);
    }
  };

  const handleDeletePerfume = async (id) => {
    try {
      if (token) {
        try {
          await fetch(`http://localhost:3001/api/perfumes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (e) {
          await fetch(`/api/perfumes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      }
      deleteFromContext(id);
      setApiPerfumes(prev => prev.filter(p => p.id !== id));
      setToast({ message: 'Perfume eliminado correctamente del catálogo', type: 'warning' });
    } catch (e) {
      console.error('Error al eliminar perfume:', e);
    }
  };

  // Categorías y Marcas únicas
  const categories = useMemo(() => {
    const set = new Set(apiPerfumes.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [apiPerfumes]);

  const brands = useMemo(() => {
    const set = new Set(apiPerfumes.map(p => p.brand).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [apiPerfumes]);

  // Filtrado de productos
  const filteredPerfumes = useMemo(() => {
    return apiPerfumes.filter(perfume => {
      const matchesSearch = 
        perfume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || perfume.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || perfume.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [apiPerfumes, searchTerm, selectedCategory, selectedBrand]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[#E8DFD8] relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#F2DDCC]/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2DDCC]/60 border border-[#F1C7A7] text-[#85544D] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fragrance Corner • Catálogo Inicial</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#85544D]">
            Colección de Fragancias Exclusivas
          </h2>
          <p className="text-sm text-[#5C423E] max-w-2xl">
            Explora el listado completo de productos de perfume almacenados en MySQL y autenticados vía JWT.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('add-product')}
          className="self-start md:self-auto bg-[#85544D] hover:bg-[#6E423C] text-[#FAF7F4] font-bold px-5 py-3 rounded-2xl border border-[#85544D]/20 shadow-md shadow-[#85544D]/15 transition-all duration-200 flex items-center gap-2.5 text-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5 text-[#F1C7A7]" />
          <span>Agregar Nuevo Perfume</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-[#E8DFD8] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85544D]/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar perfume o marca..."
            className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D] focus:ring-1 focus:ring-[#85544D]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#85544D]/70 hover:text-[#85544D]"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={fetchPerfumesFromBackend}
            title="Recargar desde MySQL Backend"
            className="p-2 rounded-xl bg-[#FAF7F4] border border-[#E8DFD8] text-[#85544D] hover:bg-[#F2DDCC]/50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingBackend ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 text-xs text-[#85544D] font-semibold shrink-0">
            <Filter className="w-4 h-4 text-[#85544D]" />
            <span>Filtrar por:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs text-[#2D2321] focus:outline-none focus:border-[#85544D] font-medium cursor-pointer"
          >
            <option value="All">Todas las familias</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs text-[#2D2321] focus:outline-none focus:border-[#85544D] font-medium cursor-pointer"
          >
            <option value="All">Todas las marcas</option>
            {brands.filter(b => b !== 'All').map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#85544D]" />
            <h3 className="text-xl font-serif font-bold text-[#85544D]">Listado de Productos</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F2DDCC]/60 text-[#85544D] font-bold border border-[#F1C7A7] ml-2">
              {filteredPerfumes.length} {filteredPerfumes.length === 1 ? 'perfume' : 'perfumes'}
            </span>
          </div>
        </div>

        {filteredPerfumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerfumes.map(perfume => (
              <ProductCard key={perfume.id} perfume={perfume} onDelete={() => handleDeletePerfume(perfume.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white border border-[#E8DFD8] rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-[#F2DDCC]/50 border border-[#F1C7A7] text-[#85544D] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#2D2321]">No se encontraron perfumes</h4>
            <p className="text-sm text-[#5C423E] mt-1 max-w-md mx-auto">
              Intenta cambiar el filtro de búsqueda o agrega un nuevo perfume a Fragrance Corner.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedBrand('All');
              }}
              className="mt-4 text-xs font-bold text-[#85544D] hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
