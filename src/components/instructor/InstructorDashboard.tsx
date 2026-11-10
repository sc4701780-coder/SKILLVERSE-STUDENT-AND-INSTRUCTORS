import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Video,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Send,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationModal } from './VerificationModal';

interface InstructorDashboardProps {
  onCreateCourseClick: () => void;
  onOpenLiveClass: (classId: string) => void;
  onOpenMessages: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  onCreateCourseClick,
  onOpenLiveClass,
  onOpenMessages
}) => {
  const {
    currentUser,
    courses,
    orders,
    liveClasses,
    privateBookings,
    reviews,
    withdrawals,
    requestWithdrawal,
    updateBookingStatus,
    formatPrice,
    platformCommissionRate,
    scheduleLiveClass
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'live' | 'private' | 'earnings' | 'withdrawals' | 'verification'
  >('overview');

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [bankName, setBankName] = useState('Deutsche Bank International');
  const [accountNumber, setAccountNumber] = useState('DE89370400440532013000');
  const [accountName, setAccountName] = useState(currentUser?.name || '');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Live class scheduling modal/form state
  const [showScheduleClassModal, setShowScheduleClassModal] = useState(false);
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassDate, setNewClassDate] = useState('2026-11-20T16:00');
  const [newClassPrice, setNewClassPrice] = useState<number>(20);
  const [newClassDuration, setNewClassDuration] = useState<number>(60);

  // Courses by this instructor
  const myCourses = courses.filter(c => c.instructorId === currentUser?.id);
  const publishedCourses = myCourses.filter(c => c.status === 'published');
  const draftCourses = myCourses.filter(c => c.status !== 'published');

  // Instructor orders & financial calculations
  const myOrders = orders.filter(o => o.instructorId === currentUser?.id);
  const totalGrossSales = myOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalNetEarnings = myOrders.reduce((sum, o) => sum + o.instructorEarnings, 0);
  const totalPlatformFees = myOrders.reduce((sum, o) => sum + o.platformCommission, 0);

  const approvedWithdrawals = withdrawals
    .filter(w => w.instructorId === currentUser?.id && w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = Math.max(0, totalNetEarnings - approvedWithdrawals);

  // Instructor Live classes
  const myLiveClasses = liveClasses.filter(c => c.instructorId === currentUser?.id);

  // Instructor Bookings
  const myBookings = privateBookings.filter(b => b.instructorId === currentUser?.id);

  const totalStudents = myCourses.reduce((sum, c) => sum + c.studentCount, 0);

  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    if (withdrawAmount > availableBalance) {
      setWithdrawError(`Requested amount exceeds available balance of ${formatPrice(availableBalance)}`);
      return;
    }
    const success = requestWithdrawal(withdrawAmount, {
      bankName,
      accountNumber,
      accountName
    });
    if (success) {
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    }
  };

  const handleCreateLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;

    scheduleLiveClass({
      title: newClassTitle,
      description: newClassDesc,
      scheduledAt: new Date(newClassDate).toISOString(),
      durationMinutes: newClassDuration,
      price: newClassPrice,
      maxCapacity: 50
    });

    setNewClassTitle('');
    setNewClassDesc('');
    setShowScheduleClassModal(false);
  };

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Instructor Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentUser?.name}
                </h1>
                {currentUser?.verificationStatus === 'approved' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Instructor
                  </span>
                ) : (
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Verification {currentUser?.verificationStatus === 'under_review' ? 'Under Review' : 'Required'}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser?.title || currentUser?.headline}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-medium">
                <span>{currentUser?.country}</span>
                <span>·</span>
                <span className="tabular-nums">{publishedCourses.length} Published Courses</span>
                <span>·</span>
                <span className="tabular-nums">{totalStudents.toLocaleString()} Students Enrolled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateCourseClick}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'courses', label: `My Courses (${myCourses.length})` },
            { id: 'live', label: `Live Workshops (${myLiveClasses.length})` },
            { id: 'private', label: `1-on-1 Bookings (${myBookings.length})` },
            { id: 'earnings', label: 'Earnings & Ledger' },
            { id: 'withdrawals', label: 'Withdrawal Payouts' },
            { id: 'verification', label: 'Verification Status' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Stat Cards (Tabular Numerals §1.D) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Available Payout Balance</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {formatPrice(availableBalance)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">85% net after 15% platform fee</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Total Lifetime Sales</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                  {formatPrice(totalGrossSales)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{myOrders.length} verified transactions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Active Students</p>
                <p className="text-2xl font-extrabold text-indigo-600 mt-1 tabular-nums">
                  {totalStudents.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Across all curriculums</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Average Instructor Rating</p>
                <div className="flex items-center gap-1.5 mt-1 text-2xl font-extrabold text-amber-500 tabular-nums">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{currentUser?.rating?.toFixed(2) || '4.95'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Based on student reviews</p>
              </div>
            </div>

            {/* Courses Overview & Action */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Curriculums &amp; Publications</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage drafts, pricing, and student analytics</p>
                </div>
                <button
                  onClick={onCreateCourseClick}
                  className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Build New Course</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {myCourses.map((c) => (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-16 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            c.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.categoryName} · {formatPrice(c.price)} · {c.durationHours}h · {c.studentCount} students
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onCreateCourseClick}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Edit Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Live Workshops Schedule */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Upcoming Live Masterclasses</h3>
                  <button
                    onClick={() => setShowScheduleClassModal(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Schedule
                  </button>
                </div>

                {myLiveClasses.length > 0 ? (
                  <div className="space-y-3">
                    {myLiveClasses.map((cls) => (
                      <div key={cls.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{cls.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(cls.scheduledAt).toLocaleDateString()} · {cls.enrolledStudentIds.length} Registered
                          </p>
                        </div>
                        <button
                          onClick={() => onOpenLiveClass(cls.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                        >
                          Host Room
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">No live workshops scheduled.</p>
                )}
              </div>

              {/* Private Consultations Roster */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Private 1-on-1 Requests</h3>
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>

                {myBookings.length > 0 ? (
                  <div className="space-y-3">
                    {myBookings.map((b) => (
                      <div key={b.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{b.studentName}</p>
                          <p className="text-[11px] text-slate-500">{b.date} ({b.timeSlot})</p>
                          <p className="text-[10px] text-emerald-600 font-bold capitalize mt-0.5">{b.status}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => updateBookingStatus(b.id, 'accepted')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateBookingStatus(b.id, 'rejected')}
                                className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onOpenLiveClass(`room-private-${b.id}`)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                            >
                              Join Call
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">No pending private bookings.</p>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Authored Courses</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect student engagement, ratings, and course status
                </p>
              </div>
              <button
                onClick={onCreateCourseClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((c) => (
                <div key={c.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div>
                    <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">{c.categoryName}</span>
                        <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 capitalize">
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{c.subtitle}</p>
                      
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/60 font-medium">
                        <span>Price: <strong>{formatPrice(c.price)}</strong></span>
                        <span className="tabular-nums">{c.studentCount} students</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={onCreateCourseClick}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                    >
                      Edit Curriculum
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EARNINGS & LEDGER */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Instructor Financial Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Itemized transaction accounting with transparent 15% platform commission tracking
              </p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Gross Sales Value</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatPrice(totalGrossSales)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Platform Commission (15%)</p>
                <p className="text-xl font-bold text-rose-600 tabular-nums mt-0.5">
                  -{formatPrice(totalPlatformFees)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Net Instructor Earnings (85%)</p>
                <p className="text-xl font-bold text-emerald-600 tabular-nums mt-0.5">
                  {formatPrice(totalNetEarnings)}
                </p>
              </div>
            </div>

            {/* Transaction Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Ref / Order ID</th>
                    <th className="py-3 font-semibold">Item &amp; Student</th>
                    <th className="py-3 font-semibold">Gross</th>
                    <th className="py-3 font-semibold">Platform (15%)</th>
                    <th className="py-3 font-semibold">Net Earnings</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono font-medium text-slate-600">{ord.transactionRef}</td>
                      <td className="py-3">
                        <p className="font-bold text-slate-900 line-clamp-1">{ord.itemTitle}</p>
                        <p className="text-[11px] text-slate-500">{ord.studentName} ({ord.studentEmail})</p>
                      </td>
                      <td className="py-3 font-bold tabular-nums text-slate-900">{formatPrice(ord.amount)}</td>
                      <td className="py-3 tabular-nums text-rose-600">-{formatPrice(ord.platformCommission)}</td>
                      <td className="py-3 font-bold tabular-nums text-emerald-600">{formatPrice(ord.instructorEarnings)}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 capitalize">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 tabular-nums">{ord.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Request Withdrawal Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Request Payout</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Available for withdrawal: <strong className="text-emerald-600 font-bold tabular-nums">{formatPrice(availableBalance)}</strong>
                </p>
              </div>

              {withdrawSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  ✓ Withdrawal request submitted for compliance clearance!
                </div>
              )}

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Withdrawal Amount (USD)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination Bank / Clearing Network
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account / IBAN Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                    required
                  />
                </div>

                {withdrawError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                    {withdrawError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={availableBalance <= 0}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    Submit Withdrawal Request
                  </button>
                </div>
              </form>
            </div>

            {/* Payout History Table */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Withdrawal History</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track the audit clearance and bank disbursement status of past payout requests
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 font-semibold">Amount</th>
                      <th className="py-3 font-semibold">Bank / IBAN</th>
                      <th className="py-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold">Requested</th>
                      <th className="py-3 font-semibold">Processed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {withdrawals
                      .filter(w => w.instructorId === currentUser?.id)
                      .map((wdr) => (
                        <tr key={wdr.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold tabular-nums text-slate-900">{formatPrice(wdr.amount)}</td>
                          <td className="py-3">
                            <p className="font-semibold text-slate-800">{wdr.bankName}</p>
                            <p className="font-mono text-[10px] text-slate-400">{wdr.accountNumber}</p>
                          </td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              wdr.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {wdr.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 tabular-nums">{wdr.requestedAt}</td>
                          <td className="py-3 text-slate-500 tabular-nums">{wdr.processedAt || 'Pending'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Instructor Verification Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SKILLVERSE enforces strict vetting to maintain high academic and vocational standards
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">Current Status</p>
                <p className="text-lg font-bold text-slate-900 capitalize mt-0.5">
                  {currentUser?.verificationStatus?.replace('_', ' ') || 'Not Submitted'}
                </p>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {currentUser?.verificationStatus === 'approved' ? 'Update Credentials' : 'Submit Credentials'}
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              <p className="font-bold text-slate-800">Verification Checklist:</p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-500">
                <li>Government-issued photo identification (Passport or National ID)</li>
                <li>Accredited degree, diploma, or verified industry certification</li>
                <li>Public portfolio, GitHub repository, or LinkedIn profile demonstrating active expertise</li>
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* Schedule Live Class Modal */}
      {showScheduleClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Live Masterclass</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set up a live interactive video session with ticketing and attendance tracking
            </p>

            <form onSubmit={handleCreateLiveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Title</label>
                <input
                  type="text"
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  placeholder="e.g. Real-Time Distributed Architecture Q&A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  placeholder="Topics to be covered during the live interactive video room..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={newClassDate}
                    onChange={(e) => setNewClassDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newClassDuration}
                    onChange={(e) => setNewClassDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={newClassPrice}
                  onChange={(e) => setNewClassPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
                <span className="text-[10px] text-slate-400">Set $0 to offer a free community workshop</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleClassModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm &amp; Publish Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
