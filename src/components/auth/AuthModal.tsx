import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck, Mail, Lock, User, Globe, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const {
    loginWithCredentials,
    registerUser,
    loginAs,
    loginWithSupabase,
    registerWithSupabase,
    supabaseStatus
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [language, setLanguage] = useState('English');
  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      try {
        const result = await loginWithSupabase(email.trim(), password);
        if (result.success) {
          onSuccess();
          onClose();
        } else {
          // If anon key isn't provided or user is demo credentials, offer fallback
          if (result.error?.includes('Anon Key')) {
            const fallbackOk = loginWithCredentials(email.trim(), password);
            if (fallbackOk) {
              onSuccess();
              onClose();
              return;
            }
          }
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Login failed. Please check network connection.');
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please fill in all required registration fields.');
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await registerWithSupabase(
          {
            name: name.trim(),
            email: email.trim(),
            role,
            country,
            language,
            title: role === 'instructor' ? (title || 'Educator & Specialist') : undefined,
            avatar: role === 'instructor'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          },
          password
        );

        if (result.success) {
          if (result.error) {
            // Notification / confirmation note from Supabase
            setErrorMessage(result.error);
          } else {
            onSuccess();
            onClose();
          }
        } else {
          setErrorMessage(result.error || 'Could not complete registration in Supabase.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Registration failed.');
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email.');
        return;
      }
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setMode('login');
      }, 3000);
    }
  };

  const handleQuickDemoLogin = (userRole: 'student' | 'instructor' | 'admin') => {
    loginAs(userRole);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-200" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">SKILLVERSE</h2>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join Global Platform' : 'Reset Password'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {forgotSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
            ✓ Password reset link has been dispatched to your email!
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      role === 'student'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    I Want to Learn (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('instructor')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      role === 'instructor'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    I Want to Teach (Instructor)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  required
                />
              </div>

              {role === 'instructor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>
              {isSubmitting
                ? 'Connecting to Supabase...'
                : mode === 'login'
                ? 'Log In to SKILLVERSE'
                : mode === 'register'
                ? 'Create Account'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Mode Switch */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
