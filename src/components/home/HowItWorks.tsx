import React from 'react';
import { Compass, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      subtitle: 'Find a skill or instructor',
      desc: 'Browse across 15 curated technical and creative disciplines. Filter by verification level, language, and curriculum depth to find your perfect mentor.',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      num: '02',
      title: 'Learn',
      subtitle: 'Flexible multimodal education',
      desc: 'Learn through structured on-demand video masterclasses, interactive live group workshops, or intensive private 1-on-1 coaching sessions.',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      num: '03',
      title: 'Grow',
      subtitle: 'Practise, connect & thrive',
      desc: 'Work on real-world assignments, join peer study communities, earn verifiable digital credentials, and unlock career opportunities worldwide.',
      icon: TrendingUp,
      color: 'from-purple-600 to-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-cyan-300 text-xs font-semibold border border-indigo-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>The SKILLVERSE Progression</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How SKILLVERSE Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            A frictionless learning ecosystem crafted to take you from foundational curiosity to verified professional mastery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-slate-800/60 rounded-3xl p-8 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-700 tabular-nums font-mono group-hover:text-indigo-400 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-300 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Integrated on desktop, tablet, and mobile</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
