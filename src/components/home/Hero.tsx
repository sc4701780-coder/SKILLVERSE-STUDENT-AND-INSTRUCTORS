import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, CheckCircle2, Play, Users, Globe2, BookOpen } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onNavigate('explore', { search: searchQuery.trim() });
    } else {
      onNavigate('explore');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-[#F8FAFC] pt-12 pb-20 lg:pt-18 lg:pb-28">
      {/* Subtle Background Geometry */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 right-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute top-48 -left-20 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 text-indigo-800 text-xs font-semibold tracking-wide border border-indigo-200/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>SKILLVERSE Global Learning &amp; Mentorship Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
              Your Next Skill Could{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Change Your Future.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover new skills, learn from experienced instructors, share your knowledge, and connect with a global community of learners and teachers.
            </p>

            {/* Live Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What skill do you want to master today? (e.g. AI, React, Design)"
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition-all duration-150 flex items-center gap-2 group"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('become_instructor')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all duration-150"
              >
                Become an Instructor
              </button>
            </div>

            {/* Platform proof points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Expert Instructors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Live Interactive Workshops</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verifiable Certificates</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual / Interactive Stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="Students and instructors learning and collaborating on laptops globally"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Floating play preview pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Live &amp; On-Demand</p>
                      <p className="text-sm font-bold truncate">Global Classrooms &amp; 1-on-1 Sessions</p>
                    </div>
                    <button
                      onClick={() => onNavigate('explore')}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                      title="Explore courses"
                    >
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-card with active statistics */}
                <div className="p-5 grid grid-cols-3 divide-x divide-slate-100 bg-white">
                  <div className="px-2 text-center">
                    <p className="text-xl font-extrabold text-slate-900 tabular-nums">48,000+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Active Learners</p>
                  </div>
                  <div className="px-2 text-center">
                    <p className="text-xl font-extrabold text-indigo-600 tabular-nums">1,200+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Expert Instructors</p>
                  </div>
                  <div className="px-2 text-center">
                    <p className="text-xl font-extrabold text-slate-900 tabular-nums">140+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Countries</p>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Micro-card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3.5 items-center gap-3 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Peer Communities</p>
                  <p className="text-[11px] text-slate-500">Discuss lessons, code reviews, and project collaboration</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
