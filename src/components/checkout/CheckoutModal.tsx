import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface CheckoutModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, formatPrice, enrollCourse, currency } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'flutterwave_card' | 'flutterwave_mobile_money' | 'bank_transfer'>('flutterwave_card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('841');
  const [billingCountry, setBillingCountry] = useState(currentUser?.country || 'United Kingdom');

  const [checkoutStep, setCheckoutStep] = useState<'input' | 'processing' | 'verifying_webhook' | 'success'>('input');
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen || !course) return null;

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    if (!currentUser) {
      setCheckoutError('Please log in first or select a student profile to enroll in this course.');
      return;
    }

    setCheckoutStep('processing');
    const ref = `FLW-TX-${Math.floor(100000000 + Math.random() * 900000000)}`;
    setTransactionRef(ref);

    // Step 1: Simulate Flutterwave Gateway Processing
    await new Promise((r) => setTimeout(r, 700));
    setCheckoutStep('verifying_webhook');

    // Step 2: Simulate Independent Server-Side Webhook Verification
    await new Promise((r) => setTimeout(r, 600));

    // Step 3: Complete enrollment & ledger entry in AppContext
    const methodLabel =
      paymentMethod === 'flutterwave_card'
        ? 'Flutterwave Global Card'
        : paymentMethod === 'flutterwave_mobile_money'
        ? 'Flutterwave Mobile Money'
        : 'Bank Direct Transfer';

    await enrollCourse(course.id, methodLabel);
    setCheckoutStep('success');

    setTimeout(() => {
      onSuccess(course.id);
      onClose();
      setCheckoutStep('input');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        
        {checkoutStep === 'input' && (
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Secure Checkout</h2>
            <p className="text-xs text-slate-500">256-Bit SSL Encrypted International Payment</p>
          </div>
        </div>

        {checkoutStep === 'input' && (
          <form onSubmit={handleProcessPayment} className="space-y-5">
            {/* Order Item Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex gap-3">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-12 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</p>
                <p className="text-[11px] text-slate-500">By {course.instructor.name}</p>
                <p className="text-xs font-extrabold text-indigo-600 mt-1 tabular-nums">
                  {formatPrice(course.price)}
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('flutterwave_card')}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    paymentMethod === 'flutterwave_card'
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1 text-indigo-600" />
                  <span>Flutterwave Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('flutterwave_mobile_money')}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    paymentMethod === 'flutterwave_mobile_money'
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mb-1 text-cyan-600" />
                  <span>Mobile Money</span>
                </button>
              </div>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Security Code (CVC)</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Billing Country</label>
                <input
                  type="text"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Total & Guaranteed settlement */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Charged ({currency}):</span>
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                {formatPrice(course.price)}
              </span>
            </div>

            {checkoutError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {checkoutError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Pay {formatPrice(course.price)} &amp; Unlock Masterclass</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Independent server webhook verification · 30-Day Money Back</span>
            </div>
          </form>
        )}

        {checkoutStep === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Initiating Flutterwave Gateway...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Creating order record and establishing secure token handshake.
            </p>
          </div>
        )}

        {checkoutStep === 'verifying_webhook' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Verifying Provider Webhook Signature...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Ref: <span className="font-mono text-slate-700">{transactionRef}</span>
              <br />
              Validating HMAC cryptographic hash to prevent unauthorized spoofing.
            </p>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Payment Verified!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Order successfully finalized. Enrolling your account and unlocking curriculum now...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
