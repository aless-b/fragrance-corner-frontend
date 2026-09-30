import React, { useState, useEffect } from 'react';
import { usePerfume } from '../context/PerfumeContext';
import { useAuthStore } from '../store/useAuthStore';
import { 
  PlusCircle, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  Droplet, 
  Upload,
  Check
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Frasco Dorado Amber', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800' },
  { label: 'Elegancia Azul Místico', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800' },
  { label: 'Cristal Cristalino', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800' },
  { label: 'Frasco Oscuro Oud', url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800' },
  { label: 'Edición Rosa Gold', url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800' }
];

export const AddProductForm = () => {
  const { addPerfume, setActiveTab } = usePerfume();
  const { token, user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Oriental',
    gender: 'Unisex',
    price: '',
    volume: '100',
    rating: '4.8',
    image: PRESET_IMAGES[0].url
  });

  const [imagePreview, setImagePreview] = useState(PRESET_IMAGES[0].url);
  const [submitting, setSubmitting] = useState(false);

  // EFECTO: Imprimir JWT en la Consola al ingresar al Formulario de Agregar Producto
  useEffect(() => {
    if (token) {
      console.log('📜 [FORMULARIO AGREGAR PRODUCTO] Bearer Token JWT:', token);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compresión JPEG con calidad 0.8 (~60-150KB) para optimizar MySQL y localStorage
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, image: compressedBase64 }));
          setImagePreview(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price) {
      alert('Por favor completa los campos requeridos: Nombre, Marca y Precio.');
      return;
    }

    setSubmitting(true);
    let savedPerfume = null;

    // 1. Guardar en el backend MySQL enviando el Bearer Token JWT
    try {
      if (token) {
        let response = null;
        try {
          response = await fetch('http://localhost:3001/api/perfumes', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
        } catch (eDirect) {
          response = await fetch('/api/perfumes', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
        }

        if (response && response.ok) {
          const json = await response.json();
          if (json.data) {
            savedPerfume = json.data;
          }
        } else if (response) {
          const errJson = await response.json().catch(() => ({}));
          console.error('⚠️ Error al registrar en MySQL:', response.status, errJson);
          alert(`Atención: El backend respondió con error ${response.status}: ${errJson.error || errJson.details || 'Error desconocido'}`);
        }
      }
    } catch (err) {
      console.warn('Error al conectar con backend MySQL:', err);
    }

    // 2. Guardar en el estado local de React y redirigir al Dashboard
    addPerfume(savedPerfume || formData);
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-xs font-semibold text-[#85544D] hover:text-[#6E423C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Dashboard</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2DDCC]/60 border border-[#F1C7A7] text-[#85544D] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alta de Producto • Fragrance Corner</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-[#E8DFD8] rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl">
        <div className="mb-8 border-b border-[#E8DFD8] pb-6">
          <h2 className="text-2xl font-serif font-bold text-[#85544D] flex items-center gap-3">
            <PlusCircle className="w-7 h-7 text-[#85544D]" />
            <span>Agregar Nuevo Perfume</span>
          </h2>
          <p className="text-sm text-[#5C423E] mt-1">
            Completa la información del perfume. Se guardará en la base de datos MySQL mediante autenticación Bearer Token JWT.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información básica */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-[#85544D] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#85544D]" />
              <span>Datos Principales del Perfume</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Nombre del Perfume <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Baccarat Rouge 540"
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 px-3.5 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D] focus:ring-1 focus:ring-[#85544D]"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Marca / Casa de Perfumería <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej: Maison Francis Kurkdjian"
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 px-3.5 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D] focus:ring-1 focus:ring-[#85544D]"
                />
              </div>

              {/* Familia Olfativa */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Familia Olfativa (Categoría)
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 px-3.5 text-sm text-[#2D2321] focus:outline-none focus:border-[#85544D] font-medium cursor-pointer"
                >
                  <option value="Oriental">Oriental</option>
                  <option value="Woody">Woody (Amaderado)</option>
                  <option value="Floral">Floral</option>
                  <option value="Fresh">Fresh (Fresco / Cítrico)</option>
                  <option value="Gourmand">Gourmand (Dulce)</option>
                </select>
              </div>

              {/* Género */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Dirigido a (Género)
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 px-3.5 text-sm text-[#2D2321] focus:outline-none focus:border-[#85544D] font-medium cursor-pointer"
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Precio ($ USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85544D] text-sm font-bold">$</span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="185"
                    className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 pl-8 pr-3 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D]"
                  />
                </div>
              </div>

              {/* Volumen */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2321] mb-1.5">
                  Volumen (ml)
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85544D]/60" />
                  <input
                    type="number"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full bg-[#FAF7F4] border border-[#E8DFD8] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#2D2321] placeholder-[#85544D]/40 focus:outline-none focus:border-[#85544D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subir Imagen del Producto */}
          <div className="space-y-4 pt-4 border-t border-[#E8DFD8]">
            <h3 className="text-sm font-bold text-[#85544D] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#85544D]" />
              <span>Imagen del Perfume</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#FAF7F4] border border-[#E8DFD8]">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-white border border-[#E8DFD8] shrink-0 relative shadow-xs">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 w-full">
                <label className="block text-xs font-semibold text-[#85544D]">
                  Subir imagen desde tu equipo:
                </label>
                <label className="inline-flex items-center gap-2 bg-[#85544D] hover:bg-[#6E423C] text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-xs transition-all">
                  <Upload className="w-4 h-4 text-[#F1C7A7]" />
                  <span>Seleccionar Archivo de Imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#5C423E]">Soporta PNG, JPG, WEBP o GIF.</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#85544D] mb-2.5">O elige una imagen de muestra:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {PRESET_IMAGES.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`cursor-pointer relative rounded-xl overflow-hidden border-2 transition-all h-20 bg-white group ${
                      formData.image === preset.url ? 'border-[#85544D] scale-[1.02] shadow-md' : 'border-[#E8DFD8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {formData.image === preset.url && (
                      <div className="absolute top-1 right-1 bg-[#85544D] text-[#FAF7F4] rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-[#E8DFD8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 rounded-xl border border-[#E8DFD8] text-[#85544D] hover:bg-[#FAF7F4] text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#85544D] hover:bg-[#6E423C] text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#85544D]/20 transition-all text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-[#F1C7A7]" />
              <span>{submitting ? 'Guardando en MySQL...' : 'Guardar Perfume'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
