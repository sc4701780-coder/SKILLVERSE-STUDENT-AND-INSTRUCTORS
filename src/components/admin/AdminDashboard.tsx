import React, { useState } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Plus,
  Trash2,
  Search,
  Sliders,
  TrendingUp,
  FileCheck,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    courses,
    orders,
    categories,
    withdrawals,
    platformCommissionRate,
    adminSetCommissionRate,
    adminApproveCourse,
    adminRejectCourse,
    adminApproveInstructor,
    adminRejectInstructor,
    adminAddCategory,
    adminDeleteCategory,
    adminProcessWithdrawal,
    formatPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'instructors' | 'withdrawals' | 'categories' | 'settings'
  >('overview');

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Code');

  const [commissionInput, setCommissionInput] = useState<number>(Math.round(platformCommissionRate * 100));
  const [commissionSaved, setCommissionSaved] = useState(false);

  // Aggregated platform stats
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalInstructors = users.filter((u) => u.role === 'instructor').length;
  const pendingInstructors = users.filter((u) => u.verificationStatus === 'under_review');
  const pendingCourses = courses.filter((c) => c.status === 'under_review');
  const totalGMV = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalPlatformRevenue = orders.reduce((sum, o) => sum + o.platformCommission, 0);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    adminSetCommissionRate(commissionInput / 100);
    setCommissionSaved(true);
    setTimeout(() => setCommissionSaved(false), 2500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    adminAddCategory({
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || 'Curated courses on SKILLVERSE.',
      iconName: newCatIcon
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Top Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Shield className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  SKILLVERSE Global Admin Control
                </h1>
                <span className="text-[10px] font-bold text-cyan-300 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Moderation queue, instructor verification compliance, ledger audit, and platform governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-medium">Configured Take Rate</p>
              <p className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
                {Math.round(platformCommissionRate * 100)}% Fee
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'courses', label: `Course Moderation (${pendingCourses.length})` },
            { id: 'instructors', label: `Instructor Approvals (${pendingInstructors.length})` },
            { id: 'withdrawals', label: `Withdrawal Queue (${pendingWithdrawals.length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'settings', label: 'Commission & Settings' }
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
            
            {/* KPI Cards (Tabular figures §1.D) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Total Platform GMV</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                  {formatPrice(totalGMV)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{orders.length} total orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Net Platform Revenue (15%)</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {formatPrice(totalPlatformRevenue)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Retained platform share</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
                <p className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums">
                  {pendingCourses.length + pendingInstructors.length}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Courses &amp; Instructor IDs</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Registered User Base</p>
                <p className="text-2xl font-extrabold text-indigo-600 mt-1 tabular-nums">
                  {users.length}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{totalInstructors} instructors · {totalStudents} learners</p>
              </div>
            </div>

            {/* Recent Orders Ledger Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Platform Transactions</h3>
                  <p className="text-xs text-slate-500">Live order audit and split disbursement tracking</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 font-semibold">Ref Code</th>
                      <th className="py-3 font-semibold">Student</th>
                      <th className="py-3 font-semibold">Item Title</th>
                      <th className="py-3 font-semibold">Total Amount</th>
                      <th className="py-3 font-semibold">Platform Fee (15%)</th>
                      <th className="py-3 font-semibold">Instructor Net</th>
                      <th className="py-3 font-semibold">Provider / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-medium text-slate-600">{ord.transactionRef}</td>
                        <td className="py-3 font-semibold text-slate-900">{ord.studentName}</td>
                        <td className="py-3 text-slate-700 max-w-xs truncate">{ord.itemTitle}</td>
                        <td className="py-3 font-bold tabular-nums text-slate-900">{formatPrice(ord.amount)}</td>
                        <td className="py-3 font-bold tabular-nums text-indigo-600">{formatPrice(ord.platformCommission)}</td>
                        <td className="py-3 tabular-nums text-emerald-600">{formatPrice(ord.instructorEarnings)}</td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COURSE MODERATION */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Course Moderation Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted masterclasses for pedagogical quality, video resolution, and academic integrity
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {courses.map((c) => (
                <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={c.thumbnail} alt={c.title} className="w-16 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'under_review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        By {c.instructor.name} · {c.categoryName} · {formatPrice(c.price)} · {c.sections.length} Sections
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status !== 'published' ? (
                      <button
                        onClick={() => adminApproveCourse(c.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Publish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => adminRejectCourse(c.id)}
                        className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Unpublish / Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INSTRUCTOR APPROVALS */}
        {activeTab === 'instructors' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Instructor Credential Verification</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit government IDs, academic degrees, and professional portfolios before authoring paid content
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {users.filter(u => u.role === 'instructor').map((inst) => (
                <div key={inst.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={inst.avatar} alt={inst.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{inst.name}</h4>
                        <span className="text-xs text-slate-400">({inst.country})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          inst.verificationStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inst.verificationStatus?.replace('_', ' ') || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{inst.title || inst.email}</p>
                      {inst.verificationDocs && (
                        <p className="text-[11px] text-indigo-600 mt-1">
                          Docs: {inst.verificationDocs.idDocument} · {inst.verificationDocs.teachingCredential}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {inst.verificationStatus !== 'approved' ? (
                      <button
                        onClick={() => adminApproveInstructor(inst.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Instructor</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => adminRejectInstructor(inst.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Revoke Approval
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Instructor Payout Clearance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve international bank wire and Flutterwave payouts
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Instructor</th>
                    <th className="py-3 font-semibold">Amount</th>
                    <th className="py-3 font-semibold">Bank &amp; Account Details</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Requested At</th>
                    <th className="py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-900">{w.instructorName}</td>
                      <td className="py-3 font-bold tabular-nums text-slate-900">{formatPrice(w.amount)}</td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{w.bankName}</p>
                        <p className="font-mono text-[10px] text-slate-500">{w.accountNumber} ({w.accountName})</p>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          w.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 tabular-nums">{w.requestedAt}</td>
                      <td className="py-3">
                        {w.status === 'pending' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => adminProcessWithdrawal(w.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => adminProcessWithdrawal(w.id, 'rejected')}
                              className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Add Learning Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Quantum Computing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Brief description of skills covered..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Create Category
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Disciplines ({categories.length})</h3>
              <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto pr-2">
                {categories.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                    </div>
                    <button
                      onClick={() => adminDeleteCategory(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="Remove category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Platform Commission Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the platform take rate dynamically applied to course sales and mentorship bookings
              </p>
            </div>

            {commissionSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                ✓ Platform commission take rate updated to {commissionInput}%!
              </div>
            )}

            <form onSubmit={handleSaveCommission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Platform Commission Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={commissionInput}
                    onChange={(e) => setCommissionInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default: 15% (Instructors receive 85% of gross sales).
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Update Take Rate
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
