import React from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { CertificateRecord } from '../../types';

interface CertificateModalProps {
  certificate: CertificateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-700">Official SKILLVERSE Digital Credential</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Canvas */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#FAFBFD] via-white to-[#F6F8FD] border-8 border-double border-indigo-950/15 shadow-inner text-center space-y-6">
          
          {/* Subtle Watermark Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-8 h-8 text-cyan-200" />
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold tracking-widest text-indigo-700 uppercase">
              SKILLVERSE Global Institute of Technology &amp; Learning
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Certificate of Mastery &amp; Completion
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              This official document certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="py-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-indigo-300 decoration-wavy underline-offset-8">
              {certificate.studentName}
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            has successfully fulfilled all rigorous coursework, architectural exercises, and project assessments for the certified masterclass:
          </p>

          {/* Course Title */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-indigo-950">
              {certificate.courseTitle}
            </h3>
          </div>

          {/* Verified Skills Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
            {certificate.skillsGained.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
              >
                ✓ {skill}
              </span>
            ))}
          </div>

          {/* Signatures and Validation Row */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center sm:text-left">
            <div>
              <p className="text-sm font-serif italic text-slate-800 font-semibold border-b border-slate-300 pb-1">
                {certificate.instructorName}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                Authorized Instructor
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 border border-amber-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-[9px] font-mono text-slate-400 mt-1">Tamper-Proof Seal</p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-mono font-bold text-slate-800">
                {certificate.issueDate}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                Date of Issue
              </p>
            </div>
          </div>

          {/* Credential ID Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Certificate ID: {certificate.certificateNumber}</span>
            <span>Verification Hash: {certificate.verificationCode}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
