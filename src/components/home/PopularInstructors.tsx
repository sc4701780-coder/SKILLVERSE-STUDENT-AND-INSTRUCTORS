import React from 'react';
import { Star, Users, MapPin, CheckCircle, UserPlus, UserCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface PopularInstructorsProps {
  onSelectInstructor: (instructor: User) => void;
  onBookPrivateSession: (instructor: User) => void;
}

export const PopularInstructors: React.FC<PopularInstructorsProps> = ({
  onSelectInstructor,
  onBookPrivateSession
}) => {
  const { users, currentUser, toggleFollowInstructor } = useApp();

  const instructors = users.filter(u => u.role === 'instructor');

  return (
    <section className="py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Global Teaching Faculty
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Instructors
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Learn directly from recognized industry researchers, software architects, and design leaders from around the world.
            </p>
          </div>
        </div>

        {/* Instructors Grid or Empty State */}
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((inst) => {
              const isFollowing = currentUser?.followingIds?.includes(inst.id);

              return (
                <div
                  key={inst.id}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                >
                  <div>
                    {/* Avatar and Verification */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        {inst.verificationStatus === 'approved' && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs"
                            title="Verified Instructor"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleFollowInstructor(inst.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                          isFollowing
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Name & Country */}
                    <div className="mb-2">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {inst.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{inst.country}</span>
                      </div>
                    </div>

                    {/* Professional Title */}
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed mb-3">
                      {inst.title || inst.headline}
                    </p>

                    {/* Skills tags - quiet clean text */}
                    {inst.skills && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {inst.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rating & Students */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 py-3 border-t border-slate-200/60 mb-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{inst.rating?.toFixed(2)}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users className="w-3 h-3" />
                        <span className="tabular-nums">{inst.studentCount?.toLocaleString()} students</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectInstructor(inst)}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onBookPrivateSession(inst)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      1-on-1 Session
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-10 text-center border border-slate-200/90 max-w-md mx-auto">
            <div className="w-12 h-12 bg-white border border-slate-200 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No instructors available yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified educators will appear here as instructor accounts register and are approved in Supabase.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
