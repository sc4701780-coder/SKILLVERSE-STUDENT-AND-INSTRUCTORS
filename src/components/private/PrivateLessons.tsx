import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Star, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, PrivateBooking } from '../../types';

interface PrivateLessonsProps {
  initialInstructor?: User;
  onBookSuccess?: () => void;
}

export const PrivateLessons: React.FC<PrivateLessonsProps> = ({ initialInstructor, onBookSuccess }) => {
  const { users, currentUser, bookPrivateLesson, formatPrice } = useApp();

  const instructors = users.filter((u) => u.role === 'instructor');
  const [selectedInstructorId, setSelectedInstructorId] = useState(
    initialInstructor?.id || instructors[0]?.id || ''
  );

  const activeInstructor = instructors.find((i) => i.id === selectedInstructorId) || instructors[0];

  const [selectedPackage, setSelectedPackage] = useState<{ title: string; hours: number; price: number }>({
    title: '1-Hour Deep-Dive Consultation',
    hours: 1,
    price: activeInstructor?.hourlyRate || 120
  });

  const [selectedDate, setSelectedDate] = useState('2026-11-18');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('15:00 - 16:00 UTC');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const availableDates = [
    { date: '2026-11-18', label: 'Wed, Nov 18' },
    { date: '2026-11-19', label: 'Thu, Nov 19' },
    { date: '2026-11-20', label: 'Fri, Nov 20' },
    { date: '2026-11-23', label: 'Mon, Nov 23' }
  ];

  const availableSlots = [
    '10:00 - 11:00 UTC',
    '13:00 - 14:00 UTC',
    '15:00 - 16:00 UTC',
    '17:00 - 18:00 UTC'
  ];

  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    if (!currentUser) {
      setBookingError('Please log in or select a student account to book a private session.');
      return;
    }

    await bookPrivateLesson({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      instructorId: activeInstructor.id,
      instructorName: activeInstructor.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      packageTitle: selectedPackage.title,
      amount: selectedPackage.price,
      notes
    });

    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      onBookSuccess?.();
    }, 2500);
  };

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Private 1-on-1 Mentorship</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Private 1-on-1 Teaching Sessions
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Get personalized code reviews, portfolio evaluations, system design advisory, and interview preparation with verified international practitioners.
          </p>
        </div>

        {instructors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No instructors available yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mentors offering 1-on-1 private lessons will appear here once registered and verified in Supabase.
            </p>
          </div>
        ) : bookingConfirmed ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-lg max-w-md mx-auto space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Session Confirmed!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your 1-on-1 session with <strong>{activeInstructor?.name}</strong> on {selectedDate} ({selectedTimeSlot}) has been verified and added to your dashboard.
            </p>
          </div>
        ) : activeInstructor ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Instructor Profile & Package Selection */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Select Instructor Dropdown/Pills */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Expert Mentor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instructors.map((inst) => {
                    const isSelected = inst.id === selectedInstructorId;
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => {
                          setSelectedInstructorId(inst.id);
                          setSelectedPackage({
                            title: '1-Hour Deep-Dive Consultation',
                            hours: 1,
                            price: inst.hourlyRate || 120
                          });
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-600/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{inst.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{inst.country}</p>
                          <p className="text-[11px] text-indigo-600 font-bold mt-0.5 tabular-nums">
                            {formatPrice(inst.hourlyRate || 120)} / hr
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Instructor Overview Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={activeInstructor.avatar}
                    alt={activeInstructor.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{activeInstructor.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">{activeInstructor.title}</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeInstructor.bio}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
                      <span>★ {activeInstructor.rating?.toFixed(2)} Rating</span>
                      <span>·</span>
                      <span>{activeInstructor.studentCount?.toLocaleString()} Students</span>
                      <span>·</span>
                      <span>Speaks: {activeInstructor.language}</span>
                    </div>
                  </div>
                </div>

                {/* Packages */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Select Lesson Package:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: '1-Hour Technical Consultation', hours: 1, multiplier: 1 },
                      { title: '3-Hour Project Architecture Review', hours: 3, multiplier: 2.7 }
                    ].map((pkg, idx) => {
                      const cost = Math.round((activeInstructor.hourlyRate || 120) * pkg.multiplier);
                      const isSelected = selectedPackage.title === pkg.title;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPackage({ title: pkg.title, hours: pkg.hours, price: cost })}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{pkg.title}</p>
                          <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>{pkg.hours} hour(s) live video</p>
                          <p className={`text-sm font-extrabold mt-2 tabular-nums ${isSelected ? 'text-white' : 'text-indigo-600'}`}>
                            {formatPrice(cost)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Date, Time & Checkout Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Date &amp; Time Slot</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sessions are held via the integrated SKILLVERSE video room
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Dates */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Available Dates</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableDates.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(d.date)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                          selectedDate === d.date
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slots */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Available Slots (UTC)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                          selectedTimeSlot === slot
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    What would you like to focus on? (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Code review on our transformer inference pipeline..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                {/* Summary & Price */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Mentor:</span>
                    <span className="font-bold text-slate-900">{activeInstructor.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Date &amp; Slot:</span>
                    <span className="font-bold text-slate-900">{selectedDate} ({selectedTimeSlot})</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                    <span>Total Investment:</span>
                    <span className="text-indigo-600 tabular-nums">{formatPrice(selectedPackage.price)}</span>
                  </div>
                </div>

                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                    {bookingError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Confirm &amp; Book 1-on-1 Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
