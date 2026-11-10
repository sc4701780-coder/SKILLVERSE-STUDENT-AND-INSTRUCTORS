import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Star, Clock, Users, BookOpen, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface ExploreCoursesProps {
  initialSearch?: string;
  initialCategory?: string;
  onSelectCourse: (courseId: string) => void;
  onEnrollCourse: (course: Course) => void;
}

export const ExploreCourses: React.FC<ExploreCoursesProps> = ({
  initialSearch = '',
  initialCategory = 'all',
  onSelectCourse,
  onEnrollCourse
}) => {
  const { courses, categories, formatPrice, getCourseEnrollment } = useApp();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.status === 'published')
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (selectedCategory === 'all') return true;
        return c.categoryId === selectedCategory;
      })
      .filter((c) => {
        if (selectedLevel === 'all') return true;
        return c.level.toLowerCase() === selectedLevel.toLowerCase();
      })
      .filter((c) => {
        if (selectedPrice === 'all') return true;
        if (selectedPrice === 'free') return c.price === 0;
        if (selectedPrice === 'paid') return c.price > 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.studentCount - a.studentCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [courses, search, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedLevel !== 'all' ? 1 : 0) +
    (selectedPrice !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedPrice('all');
    setSortBy('popular');
  };

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Bar */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Courses &amp; Masterclasses
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Discover in-depth courses taught by verified practitioners from across the globe.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, instructor, skill or technology..."
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-2xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-2xs"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Price:</span>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value="all">Any Price</option>
                <option value="paid">Paid Masterclasses</option>
                <option value="free">Free Previews</option>
              </select>
            </div>

          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-medium tabular-nums">
              Showing <strong>{filteredCourses.length}</strong> courses
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollment = getCourseEnrollment(course.id);
              const isEnrolled = !!enrollment;

              return (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      onClick={() => onSelectCourse(course.id)}
                      className="relative aspect-16/9 overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
                        {course.categoryName}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Quiet Unboxed Metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700">{course.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="tabular-nums">{course.durationHours}h</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{course.language}</span>
                      </div>

                      <h3
                        onClick={() => onSelectCourse(course.id)}
                        className="text-base font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug mb-2"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {course.subtitle}
                      </p>

                      {/* Instructor info */}
                      <div className="flex items-center gap-2 mb-4">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-slate-700 font-medium">
                          {course.instructor.name}
                        </span>
                        <span className="text-slate-400 text-[10px]">({course.instructor.country})</span>
                      </div>

                      {/* Rating and Students count */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 py-3 border-t border-slate-100">
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
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                        {formatPrice(course.price)}
                      </p>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <p className="text-xs text-slate-400 line-through tabular-nums -mt-1">
                          {formatPrice(course.originalPrice)}
                        </p>
                      )}
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Continue</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No courses matched your filters</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try adjusting your search terms, changing the category, or clearing active filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
