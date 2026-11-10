import React from 'react';
import { Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Testimonials: React.FC = () => {
  const { reviews } = useApp();
  const verifiedReviews = reviews.filter(r => r.verifiedPurchase && r.comment && r.comment.trim().length > 0);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Course Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learner Reviews &amp; Outcomes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authentic, unedited reviews published exclusively by students who have enrolled in courses on SKILLVERSE.
          </p>
        </div>

        {/* Reviews Grid or Empty State */}
        {verifiedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedReviews.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(Math.min(5, Math.max(1, item.rating)))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={item.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={item.studentName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.studentName}</h4>
                    <p className="text-[11px] text-emerald-600 font-medium">Verified Enrolled Student</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 max-w-md mx-auto shadow-2xs space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No student reviews published yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reviews are never fabricated. As enrolled students complete course lessons, their authentic reviews and feedback will be featured here.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
