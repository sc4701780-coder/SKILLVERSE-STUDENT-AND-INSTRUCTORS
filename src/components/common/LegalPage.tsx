import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'terms' | 'privacy' | 'refund' | 'community';
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'terms', onBack }) => {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'refund' | 'community'>(initialTab);

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Governance &amp; Policies</h1>
            <p className="text-xs text-slate-500">Legal commitments, user protections, and academic standards</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          {[
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'refund', label: 'Refund Policy' },
            { id: 'community', label: 'Community Guidelines' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                tab === item.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {tab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">1. Terms of Service</h2>
              <p>
                By creating an account on SKILLVERSE, users agree to uphold fair learning principles and respect intellectual property rights. Instructors retain ownership of their proprietary educational works while granting SKILLVERSE a license to distribute content to enrolled learners.
              </p>
              <h3 className="font-bold text-slate-900">2. Account Responsibility</h3>
              <p>
                Users are solely responsible for maintaining the confidentiality of login credentials. Account sharing or distribution of course video streams outside authorized enrollment licenses is strictly prohibited.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">1. Privacy &amp; Data Protection</h2>
              <p>
                SKILLVERSE adheres to international data protection principles (including GDPR and NDPR). We collect only necessary information required to facilitate account security, payments via Flutterwave, and delivery of educational video materials.
              </p>
              <h3 className="font-bold text-slate-900">2. Financial Data Handling</h3>
              <p>
                We never store raw credit card numbers or private CVVs on our application servers. All transaction processing is securely handled by PCI-DSS Level 1 compliant partners.
              </p>
            </div>
          )}

          {tab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">1. 30-Day Money-Back Guarantee</h2>
              <p>
                Students who purchase eligible on-demand courses may request a full refund within 30 days of initial purchase provided less than 25% of the curriculum has been consumed.
              </p>
              <h3 className="font-bold text-slate-900">2. Live Workshops &amp; Private 1-on-1 Sessions</h3>
              <p>
                Live classes and 1-on-1 sessions can be rescheduled or cancelled with full credit up to 24 hours prior to the scheduled start time.
              </p>
            </div>
          )}

          {tab === 'community' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">1. Community Standards</h2>
              <p>
                SKILLVERSE communities exist to foster respectful technical collaboration, mentorship, and mutual encouragement. Harassment, hate speech, plagiarism, or spam will result in immediate suspension.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
