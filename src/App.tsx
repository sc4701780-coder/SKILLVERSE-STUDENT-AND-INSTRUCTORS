import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedCourses } from './components/home/FeaturedCourses';
import { PopularInstructors } from './components/home/PopularInstructors';
import { HowItWorks } from './components/home/HowItWorks';
import { BecomeInstructorCTA } from './components/home/BecomeInstructorCTA';
import { CommunitiesPreview } from './components/home/CommunitiesPreview';
import { Testimonials } from './components/home/Testimonials';
import { ExploreCourses } from './components/courses/ExploreCourses';
import { CourseDetails } from './components/courses/CourseDetails';
import { CoursePlayer } from './components/courses/CoursePlayer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { CourseBuilder } from './components/instructor/CourseBuilder';
import { LiveClassesList } from './components/live/LiveClassesList';
import { LiveClassRoom } from './components/live/LiveClassRoom';
import { PrivateLessons } from './components/private/PrivateLessons';
import { CommunityHub } from './components/community/CommunityHub';
import { LearningPaths } from './components/paths/LearningPaths';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CertificateModal } from './components/certificates/CertificateModal';
import { CertificateVerification } from './components/certificates/CertificateVerification';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { MessagesModal } from './components/messages/MessagesModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { AboutPage } from './components/common/AboutPage';
import { LegalPage } from './components/common/LegalPage';
import { Course, CertificateRecord, User } from './types';

function MainApp() {
  const {
    currentUser,
    certificates,
    retestSupabase,
    syncWithSupabase
  } = useApp();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [playerLessonId, setPlayerLessonId] = useState<string | undefined>(undefined);
  const [activeLiveClassId, setActiveLiveClassId] = useState<string>('room-ai-llama-tune');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedPrivateInstructor, setSelectedPrivateInstructor] = useState<User | undefined>(undefined);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'community'>('terms');

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [viewedCertificate, setViewedCertificate] = useState<CertificateRecord | null>(null);

  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messagesTargetUser, setMessagesTargetUser] = useState<string | undefined>(undefined);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Router handler
  const handleNavigate = (view: string, payload?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'explore') {
      if (payload?.search) setSearchFilter(payload.search);
      if (payload?.categoryId) setSelectedCategoryFilter(payload.categoryId);
      setCurrentView('explore');
    } else if (view === 'course_details') {
      setSelectedCourseId(payload?.courseId || payload);
      setCurrentView('course_details');
    } else if (view === 'course_player') {
      setSelectedCourseId(payload?.courseId);
      setPlayerLessonId(payload?.lessonId);
      setCurrentView('course_player');
    } else if (view === 'live_room') {
      setActiveLiveClassId(payload?.classId || 'room-ai-llama-tune');
      setCurrentView('live_room');
    } else if (view === 'private_lessons') {
      setSelectedPrivateInstructor(payload?.instructor);
      setCurrentView('private_lessons');
    } else if (view === 'legal') {
      if (payload?.tab) setLegalTab(payload.tab);
      setCurrentView('legal');
    } else {
      setCurrentView(view);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleEnrollClick = (course: Course) => {
    setCheckoutCourse(course);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (courseId: string) => {
    handleNavigate('course_player', { courseId });
  };

  const handleViewCertificate = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId) || certificates[0];
    if (cert) {
      setViewedCertificate(cert);
      setIsCertModalOpen(true);
    }
  };

  const handleOpenDirectMessage = (userId: string) => {
    setMessagesTargetUser(userId);
    setIsMessagesOpen(true);
  };

  // If in live video room, render full-screen immersive conference
  if (currentView === 'live_room') {
    return (
      <LiveClassRoom
        classId={activeLiveClassId}
        onLeave={() => handleNavigate('live_classes')}
      />
    );
  }

  // If in active CoursePlayer, render immersive classroom
  if (currentView === 'course_player' && selectedCourseId) {
    return (
      <CoursePlayer
        courseId={selectedCourseId}
        initialLessonId={playerLessonId}
        onBack={() => handleNavigate('course_details', { courseId: selectedCourseId })}
        onViewCertificate={handleViewCertificate}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <Hero
              onNavigate={handleNavigate}
              onSearch={(q) => handleNavigate('explore', { search: q })}
            />
            <CategorySection
              onSelectCategory={(catId) => handleNavigate('explore', { categoryId: catId })}
              onViewAllCategories={() => handleNavigate('categories')}
            />
            <FeaturedCourses
              onSelectCourse={(cId) => handleNavigate('course_details', { courseId: cId })}
              onViewAllCourses={() => handleNavigate('explore')}
              onEnrollClick={handleEnrollClick}
            />
            <PopularInstructors
              onSelectInstructor={(inst) => handleNavigate('private_lessons', { instructor: inst })}
              onBookPrivateSession={(inst) => handleNavigate('private_lessons', { instructor: inst })}
            />
            <HowItWorks />
            <BecomeInstructorCTA
              onStartTeaching={() => {
                if (!currentUser) handleOpenAuth('register');
                else handleNavigate('instructor_dashboard');
              }}
            />
            <CommunitiesPreview
              onExploreCommunities={() => handleNavigate('communities')}
              onJoinCommunity={() => handleNavigate('communities')}
            />
            <Testimonials />
          </>
        )}

        {/* VIEW: EXPLORE COURSES */}
        {currentView === 'explore' && (
          <ExploreCourses
            initialSearch={searchFilter}
            initialCategory={selectedCategoryFilter}
            onSelectCourse={(cId) => handleNavigate('course_details', { courseId: cId })}
            onEnrollCourse={handleEnrollClick}
          />
        )}

        {/* VIEW: CATEGORIES */}
        {currentView === 'categories' && (
          <div className="py-12 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">All Learning Disciplines</h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Choose from 15 high-impact technical, artistic, and vocational categories taught on SKILLVERSE
                </p>
              </div>
              <CategorySection
                onSelectCategory={(catId) => handleNavigate('explore', { categoryId: catId })}
                onViewAllCategories={() => handleNavigate('explore')}
              />
            </div>
          </div>
        )}

        {/* VIEW: COURSE DETAILS */}
        {currentView === 'course_details' && selectedCourseId && (
          <CourseDetails
            courseId={selectedCourseId}
            onBack={() => handleNavigate('explore')}
            onEnroll={handleEnrollClick}
            onOpenPlayer={(cId, lesId) => handleNavigate('course_player', { courseId: cId, lessonId: lesId })}
          />
        )}

        {/* VIEW: STUDENT DASHBOARD */}
        {currentView === 'student_dashboard' && (
          <StudentDashboard
            onOpenCoursePlayer={(cId) => handleNavigate('course_player', { courseId: cId })}
            onExploreCourses={() => handleNavigate('explore')}
            onOpenLiveClass={(clsId) => handleNavigate('live_room', { classId: clsId })}
            onOpenMessages={() => setIsMessagesOpen(true)}
            onViewCertificate={handleViewCertificate}
            onBookPrivateSession={(inst) => handleNavigate('private_lessons', { instructor: inst })}
          />
        )}

        {/* VIEW: INSTRUCTOR DASHBOARD */}
        {currentView === 'instructor_dashboard' && (
          <InstructorDashboard
            onCreateCourseClick={() => handleNavigate('course_builder')}
            onOpenLiveClass={(clsId) => handleNavigate('live_room', { classId: clsId })}
            onOpenMessages={() => setIsMessagesOpen(true)}
          />
        )}

        {/* VIEW: COURSE BUILDER */}
        {currentView === 'course_builder' && (
          <CourseBuilder
            onBack={() => handleNavigate('instructor_dashboard')}
            onCourseCreated={(cId) => handleNavigate('course_details', { courseId: cId })}
          />
        )}

        {/* VIEW: LIVE CLASSES */}
        {currentView === 'live_classes' && (
          <LiveClassesList
            onJoinRoom={(classId) => handleNavigate('live_room', { classId })}
            onBookClass={(cls) => handleNavigate('live_room', { classId: cls.id })}
          />
        )}

        {/* VIEW: PRIVATE LESSONS */}
        {currentView === 'private_lessons' && (
          <PrivateLessons
            initialInstructor={selectedPrivateInstructor}
            onBookSuccess={() => handleNavigate('student_dashboard')}
          />
        )}

        {/* VIEW: COMMUNITIES */}
        {currentView === 'communities' && (
          <CommunityHub
            onDirectMessageUser={handleOpenDirectMessage}
          />
        )}

        {/* VIEW: LEARNING PATHS */}
        {currentView === 'learning_paths' && (
          <LearningPaths
            onSelectCourse={(cId) => handleNavigate('course_details', { courseId: cId })}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin_dashboard' && (
          <AdminDashboard />
        )}

        {/* VIEW: BECOME AN INSTRUCTOR */}
        {currentView === 'become_instructor' && (
          <div className="py-12 bg-[#F8FAFC]">
            <BecomeInstructorCTA
              onStartTeaching={() => {
                if (!currentUser) handleOpenAuth('register');
                else handleNavigate('instructor_dashboard');
              }}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <PopularInstructors
                onSelectInstructor={(inst) => handleNavigate('private_lessons', { instructor: inst })}
                onBookPrivateSession={(inst) => handleNavigate('private_lessons', { instructor: inst })}
              />
            </div>
          </div>
        )}

        {/* VIEW: CERTIFICATE VERIFICATION */}
        {currentView === 'certificate_verify' && (
          <CertificateVerification
            onBack={() => handleNavigate('home')}
            onViewCertificateModal={(cert) => {
              setViewedCertificate(cert);
              setIsCertModalOpen(true);
            }}
          />
        )}

        {/* VIEW: ABOUT SKILLVERSE */}
        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {/* VIEW: LEGAL */}
        {currentView === 'legal' && (
          <LegalPage
            initialTab={legalTab}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <CheckoutModal
        course={checkoutCourse}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {}}
      />

      <CertificateModal
        certificate={viewedCertificate}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        targetUserId={messagesTargetUser}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

      </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
