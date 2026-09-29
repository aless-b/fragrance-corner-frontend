import React from 'react';
import { usePerfume } from '../context/PerfumeContext';
import { Star, Trash2, Droplet, Sparkles, Tag } from 'lucide-react';

export const ProductCard = ({ perfume }) => {
  const { deletePerfume } = usePerfume();

  const categoryColors = {
    Oriental: 'bg-[#F2DDCC] text-[#85544D] border-[#F1C7A7]',
    Woody: 'bg-[#E8DFD8] text-[#5C423E] border-[#B1B6B2]',
    Floral: 'bg-[#FDF0E6] text-[#85544D] border-[#F1C7A7]',
    Fresh: 'bg-[#F0F4F1] text-[#4A6B5B] border-[#B1B6B2]',
    Gourmand: 'bg-[#F5EBE6] text-[#85544D] border-[#F1C7A7]'
  };

  return (
    <div className="group bg-white border border-[#E8DFD8] hover:border-[#85544D]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#85544D]/10 flex flex-col h-full">
      {/* Image Container with Badge */}
      <div className="relative h-60 w-full overflow-hidden bg-[#FAF7F4]">
        <img
          src={perfume.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800"}
          alt={perfume.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category Pill */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${categoryColors[perfume.category] || 'bg-white text-[#85544D] border-[#E8DFD8]'}`}>
          {perfume.category || 'Fragancia'}
        </span>

        {/* Volume badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-[#2D2321] border border-[#E8DFD8] backdrop-blur-md flex items-center gap-1 shadow-xs">
          <Droplet className="w-3 h-3 text-[#85544D]" />
          {perfume.volume || 50} ml
        </span>

        {/* Delete Button */}
        <button
          onClick={() => deletePerfume(perfume.id)}
          title="Eliminar perfume"
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-rose-600 text-[#85544D] hover:text-white border border-[#E8DFD8] hover:border-rose-600 backdrop-blur-md transition-all cursor-pointer shadow-sm opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#85544D] flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#85544D]" />
              {perfume.brand}
            </span>
            <div className="flex items-center gap-1 text-[#85544D] text-xs font-bold bg-[#F2DDCC]/40 px-2 py-0.5 rounded-full border border-[#F1C7A7]/50">
              <Star className="w-3 h-3 fill-[#85544D]" />
              <span>{perfume.rating || 4.8}</span>
            </div>
          </div>

          {/* Perfume Name */}
          <h3 className="text-lg font-serif font-bold text-[#2D2321] group-hover:text-[#85544D] transition-colors line-clamp-1">
            {perfume.name}
          </h3>

          {/* Gender */}
          <p className="text-xs text-[#85544D]/80 mt-1 font-medium">
            {perfume.gender || 'Unisex'}
          </p>
        </div>

        {/* Card Footer Price - ONLY "Precio" */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8DFD8]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#85544D]/70 font-semibold block">Precio</span>
            <span className="text-xl font-bold text-[#2D2321]">
              ${perfume.price?.toLocaleString()} <span className="text-xs font-normal text-[#85544D]/70">USD</span>
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#F2DDCC]/60 border border-[#F1C7A7] text-[#85544D] text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#85544D]" />
            <span>Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};
