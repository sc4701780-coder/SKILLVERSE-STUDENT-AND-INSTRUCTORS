import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  FileText,
  DollarSign,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, CourseSection, Lesson } from '../../types';

interface CourseBuilderProps {
  onBack: () => void;
  onCourseCreated: (courseId: string) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onBack, onCourseCreated }) => {
  const { categories, createCourse, currentUser, platformCommissionRate, formatPrice } = useApp();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_prog');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('All Levels');
  const [language, setLanguage] = useState('English');
  const [price, setPrice] = useState<number>(49);
  const [durationHours, setDurationHours] = useState<number>(10);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80');
  const [introVideoUrl, setIntroVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Design and deploy real-world production architectures',
    'Understand fundamental design patterns and trade-offs',
    'Write clean, maintainable, and type-safe code'
  ]);

  const [requirements, setRequirements] = useState<string[]>([
    'Basic computer literacy and enthusiasm to learn',
    'No prior specialized experience required'
  ]);

  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: `sec_1`,
      courseId: '',
      title: 'Section 1: Foundations & Architecture Setup',
      order: 1,
      lessons: [
        {
          id: `les_1_1`,
          sectionId: 'sec_1',
          title: 'Welcome & Curriculum Overview',
          durationMinutes: 15,
          type: 'video',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          content: 'Course orientation and overview of student outcomes.',
          isFreePreview: true
        },
        {
          id: `les_1_2`,
          sectionId: 'sec_1',
          title: 'Development Environment & Core Dependencies',
          durationMinutes: 25,
          type: 'video',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          content: 'Installing tooling, configuring linters, and repository cloning.',
          isFreePreview: false
        }
      ]
    }
  ]);

  // Objective handlers
  const handleAddObjective = () => setLearningObjectives(prev => [...prev, '']);
  const handleObjectiveChange = (index: number, val: string) => {
    setLearningObjectives(prev => prev.map((o, i) => (i === index ? val : o)));
  };
  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  // Requirement handlers
  const handleAddRequirement = () => setRequirements(prev => [...prev, '']);
  const handleRequirementChange = (index: number, val: string) => {
    setRequirements(prev => prev.map((r, i) => (i === index ? val : r)));
  };
  const handleRemoveRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // Section handlers
  const handleAddSection = () => {
    const newSec: CourseSection = {
      id: `sec_${Date.now()}`,
      courseId: '',
      title: `Section ${sections.length + 1}: New Curriculum Topic`,
      order: sections.length + 1,
      lessons: [
        {
          id: `les_${Date.now()}_1`,
          sectionId: `sec_${Date.now()}`,
          title: 'Lesson 1: Introduction to Topic',
          durationMinutes: 20,
          type: 'video',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          isFreePreview: false
        }
      ]
    };
    setSections(prev => [...prev, newSec]);
  };

  const handleUpdateSectionTitle = (secId: string, newTitle: string) => {
    setSections(prev => prev.map(s => (s.id === secId ? { ...s, title: newTitle } : s)));
  };

  const handleRemoveSection = (secId: string) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter(s => s.id !== secId));
  };

  // Lesson handlers
  const handleAddLesson = (secId: string) => {
    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      sectionId: secId,
      title: 'New Comprehensive Lesson',
      durationMinutes: 20,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: false
    };
    setSections(prev =>
      prev.map(s => (s.id === secId ? { ...s, lessons: [...s.lessons, newLesson] } : s))
    );
  };

  const handleUpdateLessonTitle = (secId: string, lesId: string, title: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === secId
          ? {
              ...s,
              lessons: s.lessons.map(l => (l.id === lesId ? { ...l, title } : l))
            }
          : s
      )
    );
  };

  const handleToggleFreePreview = (secId: string, lesId: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === secId
          ? {
              ...s,
              lessons: s.lessons.map(l => (l.id === lesId ? { ...l, isFreePreview: !l.isFreePreview } : l))
            }
          : s
      )
    );
  };

  const handleRemoveLesson = (secId: string, lesId: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === secId
          ? {
              ...s,
              lessons: s.lessons.filter(l => l.id !== lesId)
            }
          : s
      )
    );
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSaveCourse = (status: 'draft' | 'under_review') => {
    if (!title.trim()) {
      setValidationError('Please enter a course title before publishing.');
      return;
    }
    setValidationError(null);

    const newCourse = createCourse({
      title,
      subtitle,
      description,
      categoryId,
      level,
      language,
      price: Number(price),
      durationHours: Number(durationHours),
      thumbnail,
      introVideoUrl,
      learningObjectives: learningObjectives.filter(Boolean),
      requirements: requirements.filter(Boolean),
      sections,
      status
    });

    onCourseCreated(newCourse.id);
  };

  const estimatedPlatformFee = price * platformCommissionRate;
  const estimatedInstructorShare = price - estimatedPlatformFee;

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Instructor Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveCourse('draft')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>
            <button
              onClick={() => handleSaveCourse('under_review')}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit for Moderation</span>
            </button>
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {validationError}
          </div>
        )}

        {/* Verification Status Warning if not approved */}
        {currentUser?.verificationStatus !== 'approved' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Instructor Verification Pending</p>
              <p className="mt-0.5 text-amber-800">
                You can draft courses immediately. However, administrator verification of credentials is required before paid courses can be publicly published.
              </p>
            </div>
          </div>
        )}

        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">1. Course Details &amp; Meta</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Production Transformer Architectures in PyTorch"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Punchline</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief 1-sentence outcome for prospective students"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed curriculum overview, methodologies, project milestones..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Thumbnail URL</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Intro Video URL (MP4)</label>
                <input
                  type="url"
                  value={introVideoUrl}
                  onChange={(e) => setIntroVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Platform Commission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">2. Pricing &amp; Earnings Forecast</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Set $0 to offer a free course</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 sm:col-span-2">
              <p className="text-xs font-bold text-indigo-900 mb-2">Transparent Earnings Breakdown</p>
              <div className="flex items-center justify-between text-xs py-1 border-b border-indigo-100">
                <span className="text-slate-600">Student Enrollment Fee:</span>
                <span className="font-bold text-slate-900 tabular-nums">${price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-indigo-100">
                <span className="text-slate-600">Platform Commission ({Math.round(platformCommissionRate * 100)}%):</span>
                <span className="font-medium text-slate-500 tabular-nums">-${estimatedPlatformFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 font-bold">
                <span className="text-emerald-700">Net Instructor Earnings (85%):</span>
                <span className="text-emerald-700 text-sm tabular-nums">${estimatedInstructorShare.toFixed(2)} per sale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Objectives & Prerequisites */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">3. Learning Objectives &amp; Requirements</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">What will students learn?</label>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Outcome</span>
                </button>
              </div>

              <div className="space-y-2">
                {learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleObjectiveChange(i, e.target.value)}
                      placeholder="e.g. Build end-to-end RAG vector search pipelines"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(i)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">Prerequisites &amp; Requirements</label>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Requirement</span>
                </button>
              </div>

              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(i, e.target.value)}
                      placeholder="e.g. Basic JavaScript knowledge"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(i)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Curriculum Builder (Sections & Lessons) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">4. Curriculum Structure</h2>
              <p className="text-xs text-slate-500">Organize lessons into logical thematic sections</p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Section</span>
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                      className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lessons List in Section */}
                <div className="space-y-2 pl-3 border-l-2 border-indigo-200">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleUpdateLessonTitle(section.id, lesson.id, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded border border-slate-200 text-xs text-slate-900"
                        />
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleFreePreview(section.id, lesson.id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                            lesson.isFreePreview
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {lesson.isFreePreview ? 'Free Preview: ON' : 'Paid Access'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(section.id, lesson.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddLesson(section.id)}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson to {section.title.split(':')[0]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
