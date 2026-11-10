import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  Calendar,
  Award,
  Users,
  MessageSquare,
  Settings,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Bell,
  Star,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface StudentDashboardProps {
  onOpenCoursePlayer: (courseId: string) => void;
  onExploreCourses: () => void;
  onOpenLiveClass: (classId: string) => void;
  onOpenMessages: () => void;
  onViewCertificate: (certId: string) => void;
  onBookPrivateSession: (instructor: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenCoursePlayer,
  onExploreCourses,
  onOpenLiveClass,
  onOpenMessages,
  onViewCertificate,
  onBookPrivateSession
}) => {
  const {
    currentUser,
    courses,
    enrollments,
    liveClasses,
    privateBookings,
    certificates,
    users,
    updateUserProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'learning' | 'live' | 'private' | 'certificates' | 'settings'
  >('overview');

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editHeadline, setEditHeadline] = useState(currentUser?.headline || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Enrolled courses list
  const studentEnrollments = enrollments.filter(e => e.studentId === currentUser?.id);
  const enrolledCoursesWithProgress = studentEnrollments.map(enr => {
    const course = courses.find(c => c.id === enr.courseId);
    return { enrollment: enr, course };
  }).filter(item => !!item.course) as { enrollment: typeof studentEnrollments[0]; course: Course }[];

  // Upcoming live classes
  const myLiveClasses = liveClasses.filter(c => currentUser && c.enrolledStudentIds.includes(currentUser.id));

  // Upcoming private bookings
  const myBookings = privateBookings.filter(b => b.studentId === currentUser?.id);

  // My certificates
  const myCertificates = certificates.filter(c => c.studentId === currentUser?.id);

  // Followed instructors
  const followedInstructors = users.filter(u => currentUser?.followingIds?.includes(u.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      headline: editHeadline,
      bio: editBio
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                  Welcome back, {currentUser?.name}!
                </h1>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Student Account
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser?.headline || 'Continuous Learner · SKILLVERSE Community'}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-medium">
                <span>{currentUser?.country}</span>
                <span>·</span>
                <span className="tabular-nums">{studentEnrollments.length} Active Courses</span>
                <span>·</span>
                <span className="tabular-nums">{myCertificates.length} Certificates Earned</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreCourses}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore New Courses</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200/80 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'learning', label: `My Learning (${studentEnrollments.length})`, icon: Play },
            { id: 'live', label: `Live Classes (${myLiveClasses.length})`, icon: Video },
            { id: 'private', label: `Private Lessons (${myBookings.length})`, icon: Calendar },
            { id: 'certificates', label: `Certificates (${myCertificates.length})`, icon: Award },
            { id: 'settings', label: 'Account Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Courses In Progress</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                  {studentEnrollments.filter(e => e.progressPercent < 100).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Completed Courses</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {studentEnrollments.filter(e => e.progressPercent === 100).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Upcoming Live Classes</p>
                <p className="text-2xl font-extrabold text-indigo-600 mt-1 tabular-nums">
                  {myLiveClasses.length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Verified Certificates</p>
                <p className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums">
                  {myCertificates.length}
                </p>
              </div>
            </div>

            {/* Jump Back In - Continue Learning */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Jump Back In</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Pick up right where you left off</p>
                </div>
                <button
                  onClick={() => setActiveTab('learning')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View All ({studentEnrollments.length})
                </button>
              </div>

              {enrolledCoursesWithProgress.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCoursesWithProgress.map(({ enrollment, course }) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4 mb-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-20 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            {course.categoryName}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Instructor: {course.instructor.name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-bold tabular-nums text-slate-800">
                              {enrollment.progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {enrollment.progressPercent === 100 && enrollment.certificateId ? (
                            <button
                              onClick={() => onViewCertificate(enrollment.certificateId!)}
                              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {enrollment.completedLessonIds.length} lessons completed
                            </span>
                          )}

                          <button
                            onClick={() => onOpenCoursePlayer(course.id)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Continue</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500 mb-3">You haven't enrolled in any courses yet.</p>
                  <button
                    onClick={onExploreCourses}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Browse Course Catalog
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Live Classes & Private Lessons Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Upcoming Live Workshops */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Upcoming Live Workshops</h3>
                  <Video className="w-4 h-4 text-indigo-600" />
                </div>

                {myLiveClasses.length > 0 ? (
                  <div className="space-y-3">
                    {myLiveClasses.map((cls) => (
                      <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{cls.title}</p>
                          <p className="text-[11px] text-slate-500">Instructor: {cls.instructor.name}</p>
                          <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                            {new Date(cls.scheduledAt).toLocaleDateString()} · {cls.durationMinutes} mins
                          </p>
                        </div>
                        <button
                          onClick={() => onOpenLiveClass(cls.id)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0"
                        >
                          Join Room
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">No live workshops booked yet.</p>
                )}
              </div>

              {/* Followed Instructors */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Followed Instructors</h3>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>

                {followedInstructors.length > 0 ? (
                  <div className="space-y-3">
                    {followedInstructors.map((inst) => (
                      <div key={inst.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={inst.avatar}
                            alt={inst.name}
                            className="w-9 h-9 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{inst.name}</p>
                            <p className="text-[11px] text-slate-500">{inst.title}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onBookPrivateSession(inst)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                        >
                          Book 1-on-1
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">You are not following any instructors yet.</p>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY LEARNING */}
        {activeTab === 'learning' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Purchased Courses</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lifetime access to your courses, downloadable resources, and completion certificates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesWithProgress.map(({ enrollment, course }) => (
                <div
                  key={course.id}
                  className="bg-slate-50/80 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-36 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {course.categoryName}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500">Instructor: {course.instructor.name}</p>

                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span>
                          <span className="font-bold tabular-nums text-slate-800">
                            {enrollment.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between">
                    {enrollment.progressPercent === 100 && enrollment.certificateId && (
                      <button
                        onClick={() => onViewCertificate(enrollment.certificateId!)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </button>
                    )}
                    <button
                      onClick={() => onOpenCoursePlayer(course.id)}
                      className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Open Classroom
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CLASSES */}
        {activeTab === 'live' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Live Classes &amp; Workshops</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Join live video conferencing rooms, participate with audio/video and interactive chat
              </p>
            </div>

            {myLiveClasses.length > 0 ? (
              <div className="space-y-4">
                {myLiveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        Scheduled Workshop
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{cls.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{cls.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                        <span>Instructor: {cls.instructor.name}</span>
                        <span>·</span>
                        <span>{new Date(cls.scheduledAt).toLocaleString()}</span>
                        <span>·</span>
                        <span>{cls.durationMinutes} mins</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenLiveClass(cls.id)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Enter Video Room</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No scheduled live classes</p>
                <p className="text-xs text-slate-500 mt-1">Browse upcoming masterclasses on the live classes page.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRIVATE LESSONS */}
        {activeTab === 'private' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your 1-on-1 Mentorship Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Private consultations, architectural code reviews, and career guidance
              </p>
            </div>

            {myBookings.length > 0 ? (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{b.packageTitle}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 capitalize">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">With {b.instructorName}</p>
                      <p className="text-xs text-indigo-600 font-medium">
                        Scheduled: {b.date} ({b.timeSlot})
                      </p>
                      {b.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">Goal: "{b.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={onOpenMessages}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        Message Instructor
                      </button>
                      <button
                        onClick={() => onOpenLiveClass(`room-private-${b.id}`)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        Join Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6">You have no private sessions booked yet.</p>
            )}
          </div>
        )}

        {/* TAB 5: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verified Certificates of Completion</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every credential includes a unique tamper-proof identifier verifiable worldwide by employers
              </p>
            </div>

            {myCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {cert.certificateNumber}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-600">Issued to {cert.studentName}</p>
                      <p className="text-xs text-slate-500 mt-1">Instructor: {cert.instructorName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {cert.issueDate}</p>

                      <div className="mt-4 pt-3 border-t border-indigo-100/60">
                        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Verified Skills:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skillsGained.map((skill, idx) => (
                            <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-100 text-indigo-900 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                        {cert.verificationCode}
                      </span>
                      <button
                        onClick={() => onViewCertificate(cert.id)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6">
                Complete 100% of any enrolled course to earn your verified credential.
              </p>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Profile Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your public profile, headline, and biographical details
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  ✓ Profile updated successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="e.g. Aspiring Full-Stack Software Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell peers and instructors about your learning goals and projects..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
