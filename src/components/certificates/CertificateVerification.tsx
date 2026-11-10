import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CertificateRecord } from '../../types';

interface CertificateVerificationProps {
  onBack: () => void;
  onViewCertificateModal: (cert: CertificateRecord) => void;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({
  onBack,
  onViewCertificateModal
}) => {
  const { certificates } = useApp();

  const [searchCode, setSearchCode] = useState('SKV-2026-8842');
  const [searched, setSearched] = useState(false);
  const [matchedCert, setMatchedCert] = useState<CertificateRecord | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const query = searchCode.trim().toLowerCase();
    const found = certificates.find(
      (c) =>
        c.certificateNumber.toLowerCase() === query ||
        c.verificationCode.toLowerCase() === query ||
        c.id.toLowerCase() === query
    );

    setMatchedCert(found || null);
    setSearched(true);
  };

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Public Credential Validation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify SKILLVERSE Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Validate the authenticity, issue date, instructor signature, and skills breakdown of any credential issued by SKILLVERSE.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Certificate ID or Verification Code
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="e.g. SKV-2026-8842 or verification hash"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              Verify Credential Authenticity
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {searched && (
          <div className="animate-in fade-in duration-200">
            {matchedCert ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                      Authentic Credential Verified
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {matchedCert.courseTitle}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
                  <div>
                    <span className="text-slate-500">Student Recipient:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{matchedCert.studentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Instructed by:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{matchedCert.instructorName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Certificate Number:</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{matchedCert.certificateNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Date of Award:</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{matchedCert.issueDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Verified Acquired Competencies:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCert.skillsGained.map((skill, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onViewCertificateModal(matchedCert)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View Official Certificate Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-rose-200 text-center space-y-3">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Certificate Not Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No registered certificate was found matching the code "{searchCode}". Please ensure the ID is spelled accurately.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
