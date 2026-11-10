import React from 'react';
import { Sparkles, Globe, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-cyan-100" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SKILLVERSE</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Where knowledge meets opportunity. A modern global learning marketplace and social community connecting learners with expert instructors worldwide.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Global Platform
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Instructors
              </span>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore Learning
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  All Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Browse Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('live_classes')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Live Workshops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learning_paths')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Structured Paths
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('communities')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Skill Communities
                </button>
              </li>
            </ul>
          </div>

          {/* Teaching on Skillverse */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Teach &amp; Mentor
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('become_instructor')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Become an Instructor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('instructor_dashboard')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Instructor Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('certificate_verify')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Instructor Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Governance &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  About SKILLVERSE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', { tab: 'terms' })}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', { tab: 'privacy' })}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', { tab: 'refund' })}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal', { tab: 'community' })}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SKILLVERSE Global Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Learn. Teach. Thrive.</span>
            <span>·</span>
            <span>Multi-Currency International Settlement (USD, EUR, GBP, NGN, CAD)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
