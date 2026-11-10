import React from 'react';
import {
  BrainCircuit,
  Code,
  Globe,
  Palette,
  Film,
  TrendingUp,
  Briefcase,
  Camera,
  Scissors,
  Languages,
  GraduationCap,
  Utensils,
  Music,
  Compass,
  Wrench,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CategorySectionProps {
  onSelectCategory: (categoryId: string) => void;
  onViewAllCategories: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  onViewAllCategories
}) => {
  const { categories } = useApp();

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-200' };
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit {...props} />;
      case 'Code': return <Code {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Film': return <Film {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'Languages': return <Languages {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Music': return <Music {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      default: return <Code {...props} />;
    }
  };

  return (
    <section className="py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Curated Fields of Study
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Learning Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Explore hands-on courses taught by international practitioners across technical, creative, and vocational disciplines.
            </p>
          </div>

          <button
            onClick={onViewAllCategories}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <span>Explore All 15 Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-600 border border-slate-200/80 hover:border-indigo-600 transition-all duration-200 text-left flex flex-col justify-between h-40 shadow-2xs hover:shadow-lg hover:shadow-indigo-600/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-indigo-700/80 flex items-center justify-center shadow-2xs transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-white transition-colors leading-snug line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 group-hover:text-indigo-100 transition-colors mt-0.5 tabular-nums">
                  {cat.courseCount} courses available
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
