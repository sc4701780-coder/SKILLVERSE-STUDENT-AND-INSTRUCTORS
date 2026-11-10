import React from 'react';
import { Video, Calendar, Clock, Users, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveClass } from '../../types';

interface LiveClassesListProps {
  onJoinRoom: (classId: string) => void;
  onBookClass: (liveClass: LiveClass) => void;
}

export const LiveClassesList: React.FC<LiveClassesListProps> = ({ onJoinRoom, onBookClass }) => {
  const { liveClasses, currentUser, formatPrice } = useApp();

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 mb-2">
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Real-Time Learning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Classes &amp; Interactive Workshops
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Join live cohort sessions hosted by expert practitioners. Ask questions in real-time, share your screen for code reviews, and learn collaboratively.
          </p>
        </div>

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveClasses.map((cls) => {
            const isEnrolled = currentUser ? cls.enrolledStudentIds.includes(currentUser.id) : false;
            const scheduledDate = new Date(cls.scheduledAt);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {cls.price === 0 ? 'Free Community Workshop' : `Ticket: ${formatPrice(cls.price)}`}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{cls.enrolledStudentIds.length} / {cls.maxCapacity} Seats</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {cls.description}
                  </p>

                  {/* Instructor Bio Line */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <img
                      src={cls.instructor.avatar}
                      alt={cls.instructor.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{cls.instructor.name}</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-slate-500">{cls.instructor.title || cls.instructor.headline}</p>
                    </div>
                  </div>

                  {/* Metadata pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-6 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{scheduledDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.durationMinutes} mins)</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                    {cls.price === 0 ? 'Free' : formatPrice(cls.price)}
                  </span>

                  {isEnrolled ? (
                    <button
                      onClick={() => onJoinRoom(cls.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Classroom</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onBookClass(cls)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                    >
                      Book Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
