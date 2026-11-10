import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, BookOpen, Clock, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningPath } from '../../types';

interface LearningPathsProps {
  onSelectCourse: (courseId: string) => void;
}

export const LearningPaths: React.FC<LearningPathsProps> = ({ onSelectCourse }) => {
  const { learningPaths, courses, enrollments, currentUser } = useApp();

  const [selectedPathId, setSelectedPathId] = useState(learningPaths[0]?.id || '');
  const activePath = learningPaths.find((p) => p.id === selectedPathId) || learningPaths[0];

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Structured Career Progression</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Learning Paths
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Structured multi-stage roadmaps that systematically take you from foundational concepts through intermediate architectures to advanced production deployment.
          </p>
        </div>

        {/* Path Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPaths.map((path) => {
            const isSelected = path.id === selectedPathId;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-lg'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {path.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium tabular-nums">
                    ~{path.estimatedWeeks} Weeks
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{path.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{path.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{path.stages.length} Structured Stages</span>
                  <span className={`font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {isSelected ? 'Active Path View' : 'Select Path'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Path Stage Timeline */}
        {activePath && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Milestone Roadmap
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">{activePath.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {activePath.description}
              </p>
            </div>

            {/* Stages Stack */}
            <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {activePath.stages.map((stage) => {
                const stageCourses = courses.filter((c) => stage.courseIds.includes(c.id));
                const allCompleted = stageCourses.every((c) => {
                  const enr = enrollments.find((e) => e.studentId === currentUser?.id && e.courseId === c.id);
                  return enr?.progressPercent === 100;
                });

                return (
                  <div key={stage.stageNumber} className="relative pl-12 space-y-4">
                    {/* Circle icon marker on line */}
                    <div className="absolute left-1.5 top-1 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-xs">
                      {allCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-600 font-mono">
                          {stage.stageNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{stage.description}</p>
                    </div>

                    {/* Courses in this stage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stageCourses.map((course) => {
                        const enr = enrollments.find(
                          (e) => e.studentId === currentUser?.id && e.courseId === course.id
                        );
                        const progress = enr?.progressPercent || 0;

                        return (
                          <div
                            key={course.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between hover:border-slate-300 transition-colors"
                          >
                            <div className="flex gap-3 mb-3">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                                <p className="text-[11px] text-slate-500">Instructor: {course.instructor.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{course.durationHours}h · {course.level}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                              <span className="text-xs text-slate-500 font-medium tabular-nums">
                                {enr ? `${progress}% Completed` : 'Not Enrolled'}
                              </span>
                              <button
                                onClick={() => onSelectCourse(course.id)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                              >
                                <span>{enr ? 'View Course' : 'Inspect'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
