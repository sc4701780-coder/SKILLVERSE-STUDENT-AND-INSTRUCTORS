import React from 'react';
import { Star, Clock, Users, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface FeaturedCoursesProps {
  onSelectCourse: (courseId: string) => void;
  onViewAllCourses: () => void;
  onEnrollClick: (course: Course) => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  onSelectCourse,
  onViewAllCourses,
  onEnrollClick
}) => {
  const { courses, formatPrice, getCourseEnrollment } = useApp();

  const featuredList = courses.filter(c => c.status === 'published').slice(0, 4);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Top Rated Masterclasses
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Courses
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Immerse yourself in comprehensive curriculums designed to elevate your professional trajectory with actionable, production-ready skills.
            </p>
          </div>

          <button
            onClick={onViewAllCourses}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Courses Grid or Empty State */}
        {featuredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredList.map((course) => {
              const enrollment = getCourseEnrollment(course.id);
              const isEnrolled = !!enrollment;

              return (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectCourse(course.id)}
                    className="relative aspect-16/10 overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Category overlay */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
                      {course.categoryName}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700">{course.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="tabular-nums">{course.durationHours}h</span>
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3
                        onClick={() => onSelectCourse(course.id)}
                        className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug mb-3"
                      >
                        {course.title}
                      </h3>

                      {/* Instructor Row */}
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-slate-700 font-medium truncate">
                          {course.instructor.name}
                        </span>
                      </div>

                      {/* Rating & Students */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="tabular-nums">{course.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                        </div>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Users className="w-3 h-3" />
                          <span className="tabular-nums">{course.studentCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action Footer */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <p className="text-base font-extrabold text-slate-900 tabular-nums">
                          {formatPrice(course.price)}
                        </p>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <p className="text-[11px] text-slate-400 line-through tabular-nums -mt-1">
                            {formatPrice(course.originalPrice)}
                          </p>
                        )}
                      </div>

                      {isEnrolled ? (
                        <button
                          onClick={() => onSelectCourse(course.id)}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Continue</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onEnrollClick(course)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 max-w-md mx-auto shadow-2xs">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No courses available yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Published courses will appear here as instructors publish them to the Supabase database.
            </p>
            <button
              onClick={onViewAllCourses}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Browse Catalog
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
