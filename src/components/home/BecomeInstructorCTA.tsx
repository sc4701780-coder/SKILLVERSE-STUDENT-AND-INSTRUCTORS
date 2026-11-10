import React from 'react';
import { Sparkles, DollarSign, Users, Video, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BecomeInstructorCTAProps {
  onStartTeaching: () => void;
}

export const BecomeInstructorCTA: React.FC<BecomeInstructorCTAProps> = ({ onStartTeaching }) => {
  const { platformCommissionRate } = useApp();
  const instructorSharePercent = Math.round((1 - platformCommissionRate) * 100);

  return (
    <section className="py-20 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-cyan-300 text-xs font-semibold border border-indigo-700/80">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Teaching on SKILLVERSE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Knowledge Has Value.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-200">
                Share It With The World.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Monetize your expertise. Build on-demand courses, host live ticketed masterclasses, and provide 1-on-1 consulting to motivated international learners.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xl sm:text-2xl tabular-nums">
                  <span>{instructorSharePercent}%</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1">Instructor Payout Share</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xl sm:text-2xl tabular-nums">
                  <Video className="w-5 h-5 text-indigo-300" />
                  <span>Live + VOD</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1">Multiple Teaching Formats</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xl sm:text-2xl tabular-nums">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verified</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1">Credibility &amp; Trust Badge</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onStartTeaching}
                className="px-8 py-4 bg-white hover:bg-slate-100 text-indigo-900 text-sm font-bold rounded-xl shadow-lg transition-all duration-150 flex items-center gap-2 group"
              >
                <span>Start Teaching Today</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Teaser Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Instructor Studio Benefits
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">✓</div>
                  <span><strong>Zero upfront fees</strong> — only a transparent {Math.round(platformCommissionRate * 100)}% platform commission on completed paid sales.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">✓</div>
                  <span><strong>Built-in video classroom</strong> with participant moderation, screen sharing, and recording playback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">✓</div>
                  <span><strong>Flexible payout options</strong> supporting Flutterwave, wire transfers, and multi-currency banking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">✓</div>
                  <span><strong>Private 1-on-1 scheduling calendar</strong> where you control your hourly consulting rates.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
                All instructor applications are reviewed by SKILLVERSE platform compliance to maintain premium academic standards.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
