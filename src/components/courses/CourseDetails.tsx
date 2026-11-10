import React, { useState } from 'react';
import {
  Star,
  Clock,
  Users,
  CheckCircle2,
  Play,
  FileText,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Globe,
  Share2,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
  onEnroll: (course: Course) => void;
  onOpenPlayer: (courseId: string, lessonId?: string) => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
  courseId,
  onBack,
  onEnroll,
  onOpenPlayer
}) => {
  const { courses, formatPrice, getCourseEnrollment, reviews, addCourseReview, currentUser } = useApp();

  const course = courses.find((c) => c.id === courseId);
  const enrollment = getCourseEnrollment(courseId);
  const isEnrolled = !!enrollment;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [course?.sections[0]?.id || '']: true
  });

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Course not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to Explore
        </button>
      </div>
    );
  }

  const courseReviews = reviews.filter((r) => r.courseId === course.id);
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCourseReview(course.id, newRating, newComment);
    setNewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      
      {/* Top Banner Navigation */}
      <div className="bg-slate-900 text-white pt-8 pb-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Header Info */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <span>{course.categoryName}</span>
                <span aria-hidden="true">·</span>
                <span>{course.level}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-normal">Last updated March 2026</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  {course.reviewCount > 0 ? (
                    <>
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="tabular-nums text-white">{course.rating.toFixed(2)}</span>
                      <span className="text-slate-400 font-normal">({course.reviewCount} verified reviews)</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-normal">New · Not yet rated</span>
                  )}
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="tabular-nums">{course.studentCount.toLocaleString()} learners</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor Lead */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="text-sm font-bold text-white">{course.instructor.name}</p>
                </div>
              </div>

            </div>

            {/* Buy / Access Sticky Desktop Card */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200">
              
              {/* Video Thumbnail Preview */}
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 mb-6 group cursor-pointer"
                onClick={() => onOpenPlayer(course.id)}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-indigo-600 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/70 backdrop-blur-xs text-[11px] text-white px-2.5 py-1 rounded text-center">
                  Preview Course Syllabus &amp; Trailer
                </div>
              </div>

              {/* Price Row */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {formatPrice(course.price)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Full lifetime access including future updates
                </p>
              </div>

              {/* Action Button */}
              {isEnrolled ? (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => onOpenPlayer(course.id)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Go to Learning Room ({enrollment.progressPercent}% Done)</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    Enrolled on {enrollment.enrolledAt}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => onEnroll(course)}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-sm shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enroll Now — Instant Access</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    30-Day Money-Back Guarantee · Verified Webhook Settlement
                  </p>
                </div>
              )}

              {/* Inclusions checklist */}
              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{course.durationHours} hours of on-demand video</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Downloadable project files &amp; architecture notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Official verifiable SKILLVERSE Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct instructor Q&amp;A discussion access</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* What you'll learn */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                What you'll learn in this course
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum Syllabus */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.sections.length} sections · {totalLessons} lessons · {course.durationHours} total hours
                  </p>
                </div>
              </div>

              {/* Sections Accordion */}
              <div className="space-y-3">
                {course.sections.map((section, sIdx) => {
                  const isOpen = !!expandedSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between gap-4 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {String(sIdx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{section.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 tabular-nums">
                            {section.lessons.length} lessons
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {section.lessons.map((lesson) => {
                            const isCompleted = enrollment?.completedLessonIds.includes(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : lesson.isFreePreview || isEnrolled ? (
                                    <Play className="w-4 h-4 text-indigo-600 shrink-0" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1">
                                    {lesson.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {lesson.isFreePreview && !isEnrolled && (
                                    <button
                                      onClick={() => onOpenPlayer(course.id, lesson.id)}
                                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                      Free Preview
                                    </button>
                                  )}
                                  <span className="text-xs text-slate-400 tabular-nums">
                                    {lesson.durationMinutes} min
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Requirements &amp; Prerequisites
              </h2>
              <ul className="space-y-2.5">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor Bio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Meet Your Instructor
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{course.instructor.name}</h3>
                    {course.instructor.verificationStatus === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-indigo-600">{course.instructor.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.instructor.bio}
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span>{course.instructor.country}</span>
                    <span>·</span>
                    <span>★ {course.instructor.rating?.toFixed(2)} Instructor Rating</span>
                    <span>·</span>
                    <span>{course.instructor.studentCount?.toLocaleString()} Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews & Ratings */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Student Reviews</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified feedback from enrolled students
                  </p>
                </div>

                {isEnrolled && !showReviewForm && (
                  currentUser && courseReviews.some(r => r.studentId === currentUser.id) ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Feedback Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      Write a Review
                    </button>
                  )
                )}
              </div>

              {/* Review Input Form for Enrolled Students */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share how this course helped your skills or projects..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    required
                  />

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {courseReviews.length > 0 ? (
                  courseReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.studentAvatar}
                            alt={rev.studentName}
                            className="w-7 h-7 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{rev.studentName}</p>
                            <p className="text-[10px] text-emerald-600 font-semibold">Verified Learner</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">No student reviews yet</p>
                    <p className="text-[11px] text-slate-400">
                      Reviews are authentic and verified. Be among the first enrolled learners to complete lessons and share feedback.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
