import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Award,
  Sparkles,
  Share2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson } from '../../types';

interface CoursePlayerProps {
  courseId: string;
  initialLessonId?: string;
  onBack: () => void;
  onViewCertificate: (certId: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  courseId,
  initialLessonId,
  onBack,
  onViewCertificate
}) => {
  const {
    courses,
    currentUser,
    getCourseEnrollment,
    toggleLessonComplete,
    saveLessonNote,
    claimCertificate
  } = useApp();

  const course = courses.find((c) => c.id === courseId);
  const enrollment = getCourseEnrollment(courseId);

  // Flatten all lessons across sections
  const allLessons = course?.sections.flatMap((s) => s.lessons) || [];

  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    if (initialLessonId) return initialLessonId;
    if (enrollment?.lastAccessedLessonId) return enrollment.lastAccessedLessonId;
    return allLessons[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'discussion'>('overview');
  const [noteText, setNoteText] = useState('');
  const [isSavedNote, setIsSavedNote] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState<Array<{ id: string; author: string; text: string; time: string }>>([
    {
      id: 'd1',
      author: 'Alex Morgan',
      text: 'For the attention mask implementation, does the causal mask require float("-inf") for compatibility with standard PyTorch softmax?',
      time: '2 hours ago'
    },
    {
      id: 'd2',
      author: 'Dr. Elena Rostova',
      text: 'Yes! Using -inf ensures the exponent exp(-inf) evaluates cleanly to exactly 0 after softmax normalization.',
      time: '1 hour ago'
    }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);

  // Load existing note when lesson changes
  useEffect(() => {
    if (enrollment?.notes && activeLesson) {
      setNoteText(enrollment.notes[activeLesson.id] || '');
    } else {
      setNoteText('');
    }
  }, [activeLessonId, enrollment]);

  if (!course || !activeLesson) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Course lesson not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Back
        </button>
      </div>
    );
  }

  const isCurrentCompleted = enrollment?.completedLessonIds.includes(activeLesson.id);
  const progressPercent = enrollment?.progressPercent || 0;
  const isFinished = progressPercent === 100;

  const handleNextLesson = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[activeLessonIndex + 1].id);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonId(allLessons[activeLessonIndex - 1].id);
    }
  };

  const handleSaveNote = () => {
    saveLessonNote(course.id, activeLesson.id, noteText);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setDiscussions((prev) => [
      ...prev,
      {
        id: `d_${Date.now()}`,
        author: currentUser?.name || 'Learner',
        text: newQuestion.trim(),
        time: 'Just now'
      }
    ]);
    setNewQuestion('');
  };

  const handleClaimCertificateClick = () => {
    const cert = claimCertificate(course.id);
    onViewCertificate(cert.id);
  };

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen flex flex-col">
      
      {/* Top Learning Classroom Header */}
      <header className="h-14 bg-[#111827] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Classroom"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xs font-bold text-white line-clamp-1 max-w-md">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              Instructor: {course.instructor.name}
            </p>
          </div>
        </div>

        {/* Progress & Certificate Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
              {progressPercent}%
            </span>
          </div>

          {isFinished && (
            <button
              onClick={handleClaimCertificateClick}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Zone: Video Player and Content Tabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* HTML5 Video Player */}
          <div className="relative aspect-16/9 w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {activeLesson.videoUrl ? (
              <video
                key={activeLesson.id}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                poster={course.thumbnail}
              >
                <source src={activeLesson.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video streaming.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900">
                <BookOpen className="w-12 h-12 text-indigo-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">{activeLesson.title}</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  This is an interactive reading and project lesson. Review the notes and downloadable resources below.
                </p>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Lesson {activeLessonIndex + 1} of {allLessons.length}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Previous Lesson */}
              <button
                onClick={handlePrevLesson}
                disabled={activeLessonIndex === 0}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 rounded-xl transition-colors"
                title="Previous Lesson"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Complete Lesson Button */}
              <button
                onClick={() => toggleLessonComplete(course.id, activeLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              {/* Next Lesson */}
              <button
                onClick={handleNextLesson}
                disabled={activeLessonIndex === allLessons.length - 1}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 rounded-xl transition-colors"
                title="Next Lesson"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation Deck */}
          <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 relative transition-colors ${
                activeTab === 'overview' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`py-2.5 relative transition-colors ${
                activeTab === 'resources' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resources ({activeLesson.resources?.length || 0})
              {activeTab === 'resources' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 relative transition-colors ${
                activeTab === 'notes' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Notes
              {activeTab === 'notes' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`py-2.5 relative transition-colors ${
                activeTab === 'discussion' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q&amp;A Discussion ({discussions.length})
              {activeTab === 'discussion' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">Lesson Summary</h3>
                <p>
                  {activeLesson.content ||
                    'In this lesson, you explore key system design principles, inspect live code patterns, and verify architectural invariants against production constraints.'}
                </p>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-indigo-400">Key Takeaway:</p>
                  <p className="text-xs text-slate-400">
                    Always benchmark and measure latency impact under synthetic high-concurrency loads before committing algorithmic updates to main pipelines.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white mb-2">Downloadable Lesson Materials</h3>
                {activeLesson.resources && activeLesson.resources.length > 0 ? (
                  activeLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">{res.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-mono">{res.fileType} · {res.size}</p>
                        </div>
                      </div>
                      <a
                        href={res.downloadUrl}
                        download
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">
                    No external attachments for this lesson. Refer to the overview notes.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Your Personal Lesson Notepad</h3>
                  {isSavedNote && (
                    <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                      ✓ Note saved automatically
                    </span>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your notes, equations, code snippets, or thoughts for this lesson..."
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Save Note to Account
                </button>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-white">Course Q&amp;A Thread</h3>
                
                {/* Submit Question */}
                <form onSubmit={handlePostQuestion} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a technical question about this lesson..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                    >
                      Post Question
                    </button>
                  </div>
                </form>

                {/* Question List */}
                <div className="space-y-3 pt-2">
                  {discussions.map((d) => (
                    <div key={d.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{d.author}</span>
                        <span className="text-[11px] text-slate-500">{d.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{d.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Zone: Course Syllabus Sidebar */}
        <aside className="w-full lg:w-80 bg-[#111827] border-t lg:border-t-0 lg:border-l border-slate-800 p-4 shrink-0 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Course Curriculum
          </h3>

          <div className="space-y-4">
            {course.sections.map((section, sIdx) => (
              <div key={section.id} className="space-y-1.5">
                <p className="text-xs font-bold text-slate-200 px-2">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = enrollment?.completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'hover:bg-slate-800/80 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isActive ? 'text-white' : 'text-emerald-400'
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isActive ? 'text-white' : 'text-slate-600'
                            }`}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs leading-snug line-clamp-1 ${
                              isActive ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <span
                            className={`text-[10px] tabular-nums ${
                              isActive ? 'text-indigo-200' : 'text-slate-500'
                            }`}
                          >
                            {lesson.durationMinutes} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};
