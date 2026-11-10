import React from 'react';
import { Sparkles, Globe, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Brand Mission &amp; Identity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            SKILLVERSE is Where Knowledge Meets Opportunity.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Our mission is to make learning and teaching accessible to everyone, everywhere, by creating a global community where people share knowledge, develop valuable skills, connect with instructors, and create opportunities.
          </p>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Global Accessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed from day one for international learners across Europe, the Americas, Africa, and Asia, featuring localized currencies and seamless Flutterwave clearing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Rigorous Instructor Vetting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every instructor is vetted against certified identity and teaching credentials before publishing paid courses, ensuring students receive world-class education.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verifiable Credentials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certificates earned on SKILLVERSE feature cryptographic hashes that can be independently audited by hiring managers worldwide on our public verification portal.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Brand Personality &amp; Culture</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">● Innovative &amp; Modern</div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">● Welcoming &amp; Inclusive</div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">● Trustworthy &amp; Rigorous</div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">● Community-Oriented</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white space-y-4">
          <h2 className="text-2xl font-bold">Ready to Start Your Learning Journey?</h2>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow-md hover:bg-slate-100"
            >
              Browse Courses
            </button>
            <button
              onClick={() => onNavigate('become_instructor')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Become an Instructor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
