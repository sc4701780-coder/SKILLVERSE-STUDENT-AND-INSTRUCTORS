import React, { useState } from 'react';
import { ShieldCheck, UploadCloud, X, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitInstructorVerification } = useApp();

  const [idDocument, setIdDocument] = useState('Passport_National_ID_Scan.pdf');
  const [teachingCredential, setTeachingCredential] = useState('University_Degree_Or_Industry_Cert.pdf');
  const [portfolioUrl, setPortfolioUrl] = useState('https://linkedin.com/in/my-profile');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInstructorVerification({
      idDocument,
      teachingCredential,
      portfolioUrl
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Instructor Verification</h2>
            <p className="text-xs text-slate-500">Submit compliance credentials to publish paid courses</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our academic compliance officers will verify your identity documents within 24–48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Why Verification Matters:</p>
              <p>SKILLVERSE guarantees students that every instructor possesses verified real-world experience and legitimate qualifications.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Government-Issued Photo ID (Passport / National ID)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="flex-1 truncate">{idDocument}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Degree, Certification or Industry Proof
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="flex-1 truncate">{teachingCredential}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portfolio, GitHub or Professional Profile URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Submit Documents
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
