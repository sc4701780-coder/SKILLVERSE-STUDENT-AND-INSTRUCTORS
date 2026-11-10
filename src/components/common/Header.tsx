import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bell,
  MessageSquare,
  Globe,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Shield,
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenMessages: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenMessages,
  onOpenNotifications
}) => {
  const {
    currentUser,
    loginAs,
    logout,
    currency,
    setCurrency,
    notifications,
    messages,
    supabaseStatus
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read && m.receiverId === currentUser?.id).length;

  const handleRoleQuickSwitch = (role: 'student' | 'instructor' | 'admin') => {
    loginAs(role);
    if (role === 'student') onNavigate('student_dashboard');
    else if (role === 'instructor') onNavigate('instructor_dashboard');
    else if (role === 'admin') onNavigate('admin_dashboard');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { id: 'explore', label: 'Explore Courses' },
    { id: 'categories', label: 'Categories' },
    { id: 'live_classes', label: 'Live Classes' },
    { id: 'communities', label: 'Communities' },
    { id: 'learning_paths', label: 'Learning Paths' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 md:gap-8">
          
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  SKILLVERSE
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-slate-500 uppercase tracking-wider -mt-1">
                  Learn · Teach · Thrive
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: NAVIGATION LINKS (Single line, whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & AUTH */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60"
                title="Change display currency"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  {(['USD', 'EUR', 'GBP', 'NGN', 'CAD'] as CurrencyCode[]).map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currency === c ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-400 text-[11px]">
                        {c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'GBP' ? '£' : c === 'NGN' ? '₦' : 'CA$'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            {currentUser && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            )}

            {/* Direct Messages Button */}
            {currentUser && (
              <button
                onClick={onOpenMessages}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
            )}

            {/* Logged In User Pill & Role Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] font-medium text-indigo-600 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="p-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>{currentUser.country}</span>
                        <span>·</span>
                        <span className="capitalize font-medium text-indigo-600">{currentUser.role} Account</span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5">
                      {currentUser.role === 'student' && (
                        <button
                          onClick={() => {
                            onNavigate('student_dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                          <span>Student Dashboard</span>
                        </button>
                      )}

                      {currentUser.role === 'instructor' && (
                        <button
                          onClick={() => {
                            onNavigate('instructor_dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                        >
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span>Instructor Studio</span>
                        </button>
                      )}

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            onNavigate('admin_dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                        >
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onNavigate('certificate_verify');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Verify Certificate</span>
                      </button>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                            onNavigate('home');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-xs shadow-indigo-600/20 whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                currentView === link.id
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('become_instructor');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              Become an Instructor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
