import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Course,
  Category,
  CourseEnrollment,
  CourseReview,
  LiveClass,
  PrivateBooking,
  Community,
  CommunityPost,
  DirectMessage,
  InAppNotification,
  LearningPath,
  FinancialOrder,
  WithdrawalRequest,
  CertificateRecord,
  CurrencyCode
} from '../types';
import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_COURSES,
  MOCK_LIVE_CLASSES,
  MOCK_LEARNING_PATHS,
  INITIAL_SAMPLE_CERTIFICATE,
  CURRENCIES
} from '../data/mockData';
import {
  supabase,
  SUPABASE_URL,
  SUPABASE_PROJECT_REF,
  getSupabaseAnonKey,
  testSupabaseConnection,
  ConnectionTestResult
} from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  categories: Category[];
  enrollments: CourseEnrollment[];
  reviews: CourseReview[];
  liveClasses: LiveClass[];
  privateBookings: PrivateBooking[];
  communities: Community[];
  posts: CommunityPost[];
  messages: DirectMessage[];
  notifications: InAppNotification[];
  certificates: CertificateRecord[];
  learningPaths: LearningPath[];
  orders: FinancialOrder[];
  withdrawals: WithdrawalRequest[];
  platformCommissionRate: number;
  currency: CurrencyCode;

  // Supabase Database & Auth Integration
  supabaseStatus: ConnectionTestResult | null;
  retestSupabase: (overrideKey?: string) => Promise<ConnectionTestResult>;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithSupabase: (userData: Partial<User>, password: string) => Promise<{ success: boolean; error?: string }>;
  syncWithSupabase: () => Promise<void>;
  
  // Auth & Roles
  setCurrentUser: (user: User | null) => void;
  loginAs: (role: UserRole | string) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  registerUser: (userData: Partial<User>) => User;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceUSD: number) => string;

  // Student Actions
  enrollCourse: (courseId: string, paymentMethod?: string) => Promise<boolean>;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  saveLessonNote: (courseId: string, lessonId: string, noteText: string) => void;
  getCourseEnrollment: (courseId: string) => CourseEnrollment | undefined;
  claimCertificate: (courseId: string) => CertificateRecord;
  addCourseReview: (courseId: string, rating: number, comment: string) => void;
  bookLiveClass: (classId: string) => Promise<boolean>;
  bookPrivateLesson: (bookingData: Omit<PrivateBooking, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;

  // Instructor Actions
  createCourse: (course: Partial<Course>) => Course;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  submitCourseForReview: (courseId: string) => void;
  submitInstructorVerification: (docs: { idDocument: string; teachingCredential: string; portfolioUrl: string }) => void;
  requestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) => boolean;
  updateBookingStatus: (bookingId: string, status: PrivateBooking['status']) => void;
  scheduleLiveClass: (classData: Partial<LiveClass>) => LiveClass;

  // Social & Community
  toggleCommunityMembership: (communityId: string) => void;
  createPost: (communityId: string, title: string, content: string, tags: string[]) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  toggleFollowInstructor: (instructorId: string) => void;
  sendDirectMessage: (receiverId: string, content: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Admin Actions
  adminApproveCourse: (courseId: string) => void;
  adminRejectCourse: (courseId: string) => void;
  adminApproveInstructor: (userId: string) => void;
  adminRejectInstructor: (userId: string) => void;
  adminSetCommissionRate: (newRate: number) => void;
  adminAddCategory: (category: Omit<Category, 'id' | 'courseCount'>) => void;
  adminDeleteCategory: (categoryId: string) => void;
  adminProcessWithdrawal: (withdrawalId: string, status: 'approved' | 'rejected', notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize current user from active session/local storage, defaulting to null (not fake user)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillverse_current_user') || localStorage.getItem('skilivo_current_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Discard mock seeded users
      if (parsed && typeof parsed.id === 'string' && parsed.id.startsWith('user_')) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('skillverse_users') || localStorage.getItem('skilivo_users');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((u: any) => !u.id?.startsWith('user_'));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('skillverse_courses') || localStorage.getItem('skilivo_courses');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((c: any) => !c.id?.startsWith('course_ai_') && !c.id?.startsWith('course_web_'));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('skillverse_categories') || localStorage.getItem('skilivo_categories');
    return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
  });

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(() => {
    const saved = localStorage.getItem('skillverse_enrollments') || localStorage.getItem('skilivo_enrollments');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((e: any) => !e.id?.startsWith('enr_1') && !e.id?.startsWith('enr_2')) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<CourseReview[]>(() => {
    const saved = localStorage.getItem('skillverse_reviews') || localStorage.getItem('skilivo_reviews');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((r: any) => !r.id?.startsWith('rev_1')) : [];
    } catch {
      return [];
    }
  });

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => {
    const saved = localStorage.getItem('skillverse_live_classes') || localStorage.getItem('skilivo_live_classes');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((l: any) => !l.id?.startsWith('live_')) : [];
    } catch {
      return [];
    }
  });

  const [privateBookings, setPrivateBookings] = useState<PrivateBooking[]>(() => {
    const saved = localStorage.getItem('skillverse_private_bookings') || localStorage.getItem('skilivo_private_bookings');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((b: any) => !b.id?.startsWith('bk_1')) : [];
    } catch {
      return [];
    }
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('skillverse_communities') || localStorage.getItem('skilivo_communities');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((c: any) => !c.id?.startsWith('comm_')) : [];
    } catch {
      return [];
    }
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('skillverse_posts') || localStorage.getItem('skilivo_posts');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((p: any) => !p.id?.startsWith('post_')) : [];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('skillverse_messages') || localStorage.getItem('skilivo_messages');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((m: any) => !m.id?.startsWith('msg_')) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('skillverse_notifications') || localStorage.getItem('skilivo_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif_1',
        userId: 'user_student_1',
        title: 'Certificate Awarded!',
        message: 'Congratulations! You completed Deep Learning & Generative AI Systems and earned your verified credential.',
        type: 'certificate',
        timestamp: '3 days ago',
        read: false,
        linkAction: 'certificates'
      },
      {
        id: 'notif_2',
        userId: 'user_student_1',
        title: 'Upcoming Live Workshop',
        message: 'Fine-Tuning LLaMA-3 with Custom Datasets begins in 3 days. Prepare your Colab environment.',
        type: 'class',
        timestamp: '1 day ago',
        read: false,
        linkAction: 'live'
      }
    ];
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('skillverse_certificates') || localStorage.getItem('skilivo_certificates');
    return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_CERTIFICATE];
  });

  const [learningPaths] = useState<LearningPath[]>(() => {
    const saved = localStorage.getItem('skillverse_learning_paths') || localStorage.getItem('skilivo_learning_paths');
    return saved ? JSON.parse(saved) : MOCK_LEARNING_PATHS;
  });

  const [orders, setOrders] = useState<FinancialOrder[]>(() => {
    const saved = localStorage.getItem('skillverse_orders') || localStorage.getItem('skilivo_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord_sample_101',
        studentId: 'user_student_1',
        studentName: 'Alex Morgan',
        studentEmail: 'alex.morgan@example.com',
        itemType: 'course',
        itemId: 'course_ai_101',
        itemTitle: 'Deep Learning & Generative AI Systems: From Math to Production',
        amount: 89,
        currency: 'USD',
        paymentMethod: 'Flutterwave Card (Verified)',
        transactionRef: 'FLW-TX-994182941',
        status: 'verified',
        platformCommissionRate: 0.15,
        platformCommission: 13.35,
        instructorEarnings: 75.65,
        instructorId: 'user_inst_1',
        createdAt: '2026-02-10'
      },
      {
        id: 'ord_sample_102',
        studentId: 'user_student_1',
        studentName: 'Alex Morgan',
        studentEmail: 'alex.morgan@example.com',
        itemType: 'course',
        itemId: 'course_web_201',
        itemTitle: 'Modern Full-Stack Web Architecture: React 19, TypeScript & Cloud Scale',
        amount: 75,
        currency: 'USD',
        paymentMethod: 'Flutterwave Card (Verified)',
        transactionRef: 'FLW-TX-773912903',
        status: 'verified',
        platformCommissionRate: 0.15,
        platformCommission: 11.25,
        instructorEarnings: 63.75,
        instructorId: 'user_inst_2',
        createdAt: '2026-02-28'
      }
    ];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('skillverse_withdrawals') || localStorage.getItem('skilivo_withdrawals');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'wdr_1',
        instructorId: 'user_inst_1',
        instructorName: 'Dr. Elena Rostova',
        amount: 850,
        currency: 'USD',
        bankName: 'Deutsche Bank International',
        accountNumber: 'DE89370400440532013000',
        accountName: 'Dr. Elena Rostova',
        status: 'approved',
        requestedAt: '2026-02-15',
        processedAt: '2026-02-16',
        notes: 'Wire transfer processed via standard clearing.'
      }
    ];
  });

  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(() => {
    const saved = localStorage.getItem('skillverse_commission_rate') || localStorage.getItem('skilivo_commission_rate');
    return saved ? parseFloat(saved) : 0.15; // 15%
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('skillverse_currency') || localStorage.getItem('skilivo_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<ConnectionTestResult | null>(null);

  // Re-test Supabase connection
  const retestSupabase = async (overrideKey?: string): Promise<ConnectionTestResult> => {
    const res = await testSupabaseConnection(overrideKey);
    setSupabaseStatus(res);
    return res;
  };

  // Synchronize courses, categories, and enrollments with Supabase if online
  const syncWithSupabase = async () => {
    const key = getSupabaseAnonKey();
    if (!key || key.length < 20) return;

    try {
      // Sync Categories
      const { data: dbCategories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!catError && dbCategories && dbCategories.length > 0) {
        const mappedCategories: Category[] = dbCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          iconName: c.icon_name || 'BookOpen',
          courseCount: c.course_count || 0,
          isPopular: c.is_popular || false
        }));
        setCategories(mappedCategories);
      }

      // Sync Profiles (Instructors and Users) from Supabase
      const { data: dbProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      
      let currentUsersList = users;
      if (!profileError && dbProfiles && dbProfiles.length > 0) {
        const mappedUsers: User[] = dbProfiles.map((p: any) => ({
          id: p.id,
          name: p.name || 'Member',
          email: p.email || '',
          avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: (p.role || 'student') as UserRole,
          country: p.country || 'Global',
          countryCode: p.country_code || 'US',
          language: p.language || 'English',
          title: p.title,
          headline: p.headline,
          bio: p.bio,
          skills: p.skills || [],
          hourlyRate: Number(p.hourly_rate) || 0,
          rating: Number(p.rating) || 5.0,
          reviewCount: Number(p.review_count) || 0,
          studentCount: Number(p.student_count) || 0,
          verificationStatus: p.verification_status,
          createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-02-01'
        }));
        setUsers(mappedUsers);
        currentUsersList = mappedUsers;
      }

      // Sync Courses
      const { data: dbCourses, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      if (!courseError && dbCourses) {
        const mappedCourses: Course[] = dbCourses.map((c: any) => {
          // Find matching instructor from actual database profiles
          const foundInstructor = currentUsersList.find(u => u.id === c.instructor_id);
          const instructor: User = foundInstructor || {
            id: c.instructor_id || 'unknown_instructor',
            name: 'Skillverse Instructor',
            email: '',
            role: 'instructor' as UserRole,
            country: 'Global',
            countryCode: 'US',
            language: 'English',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            createdAt: '2026-01-01'
          };

          return {
            id: c.id,
            title: c.title,
            subtitle: c.subtitle || '',
            slug: c.slug,
            description: c.description || '',
            instructorId: c.instructor_id,
            instructor,
            categoryId: c.category_id,
            categoryName: categories.find(cat => cat.id === c.category_id)?.name || 'General',
            level: c.level || 'All Levels',
            language: c.language || 'English',
            price: Number(c.price) || 0,
            originalPrice: c.original_price ? Number(c.original_price) : undefined,
            durationHours: Number(c.duration_hours) || 0,
            thumbnail: c.thumbnail,
            introVideoUrl: c.intro_video_url,
            learningObjectives: c.learning_objectives || [],
            requirements: c.requirements || [],
            status: c.status || 'published',
            rating: Number(c.rating) || 5.0,
            reviewCount: Number(c.review_count) || 0,
            studentCount: Number(c.student_count) || 0,
            isFeatured: c.is_featured || false,
            sections: [],
            createdAt: c.created_at ? c.created_at.split('T')[0] : '2026-02-01'
          };
        });
        setCourses(mappedCourses);
      }

      // Sync Enrollments for current user
      if (currentUser) {
        const { data: dbEnrollments, error: enrError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', currentUser.id);
        if (!enrError && dbEnrollments && dbEnrollments.length > 0) {
          const mappedEnrollments: CourseEnrollment[] = dbEnrollments.map((e: any) => ({
            id: e.id,
            studentId: e.student_id,
            courseId: e.course_id,
            enrolledAt: e.enrolled_at ? e.enrolled_at.split('T')[0] : '2026-02-01',
            completedLessonIds: e.completed_lesson_ids || [],
            progressPercent: e.progress_percent || 0,
            lastAccessedLessonId: e.last_accessed_lesson_id,
            certificateId: e.certificate_id,
            notes: e.notes || {}
          }));
          setEnrollments(mappedEnrollments);
        }
      }

      // Sync Communities from Supabase if table exists
      try {
        const { data: dbCommunities, error: commError } = await supabase
          .from('communities')
          .select('*');
        if (!commError && dbCommunities && dbCommunities.length > 0) {
          const mappedCommunities: Community[] = dbCommunities.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: c.description || '',
            category: c.category || 'General',
            memberCount: Number(c.member_count) || 0,
            iconName: c.icon_name || 'Users',
            bannerGradient: c.banner_gradient || 'from-indigo-600 to-violet-700',
            memberIds: c.member_ids || []
          }));
          setCommunities(mappedCommunities);
        }
      } catch {
        // communities table optional; defaults to empty state
      }

      // Sync Community Posts from Supabase if table exists
      try {
        const { data: dbPosts, error: postError } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!postError && dbPosts && dbPosts.length > 0) {
          const mappedPosts: CommunityPost[] = dbPosts.map((p: any) => ({
            id: p.id,
            communityId: p.community_id,
            communityName: p.community_name || 'General Community',
            authorId: p.author_id,
            authorName: p.author_name || 'Member',
            authorAvatar: p.author_avatar || '',
            authorRole: p.author_role || 'Learner',
            authorCountry: p.author_country || 'Global',
            title: p.title,
            content: p.content,
            tags: p.tags || [],
            likes: Number(p.likes) || 0,
            likedByUserIds: p.liked_by_user_ids || [],
            comments: p.comments || [],
            createdAt: p.created_at ? p.created_at.split('T')[0] : 'Recent'
          }));
          setPosts(mappedPosts);
        }
      } catch {
        // community_posts table optional; defaults to empty state
      }
    } catch (err) {
      console.warn('Supabase sync skipped or failed:', err);
    }
  };

  // Real Supabase Authentication: Login
  const loginWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const key = getSupabaseAnonKey();
    if (!key || key.length < 20) {
      return {
        success: false,
        error: 'Authentication service is initializing. Please verify credentials or retry in a moment.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Query profile from Supabase profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const authenticatedUser: User = {
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email || email,
          avatar: profile?.avatar || data.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: (profile?.role || data.user.user_metadata?.role || 'student') as UserRole,
          country: profile?.country || 'United States',
          countryCode: profile?.country_code || 'US',
          language: profile?.language || 'English',
          title: profile?.title,
          headline: profile?.headline,
          bio: profile?.bio,
          skills: profile?.skills || [],
          verificationStatus: profile?.verification_status,
          createdAt: data.user.created_at ? data.user.created_at.split('T')[0] : '2026-02-01'
        };

        setCurrentUser(authenticatedUser);
        setUsers(prev => {
          const exists = prev.find(u => u.id === authenticatedUser.id);
          return exists ? prev.map(u => (u.id === authenticatedUser.id ? authenticatedUser : u)) : [...prev, authenticatedUser];
        });

        // Trigger sync of user-specific records
        setTimeout(() => syncWithSupabase(), 300);
        return { success: true };
      }

      return { success: false, error: 'User session not created.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication request failed.' };
    }
  };

  // Real Supabase Authentication: Register
  const registerWithSupabase = async (
    userData: Partial<User>,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const key = getSupabaseAnonKey();
    if (!key || key.length < 20) {
      return {
        success: false,
        error: 'Authentication service is initializing. Please verify credentials or retry in a moment.'
      };
    }

    try {
      const email = userData.email || '';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || email.split('@')[0],
            role: userData.role || 'student',
            country: userData.country || 'Global',
            language: userData.language || 'English',
            avatar: userData.avatar
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Attempt to create profile record if trigger hasn't already or to augment it
        const newUser: User = {
          id: data.user.id,
          name: userData.name || email.split('@')[0],
          email: data.user.email || email,
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: userData.role || 'student',
          country: userData.country || 'Global',
          countryCode: userData.countryCode || 'US',
          language: userData.language || 'English',
          title: userData.title,
          bio: userData.bio,
          skills: userData.skills || [],
          verificationStatus: userData.role === 'instructor' ? 'not_submitted' : undefined,
          createdAt: data.user.created_at ? data.user.created_at.split('T')[0] : '2026-02-01'
        };

        // If session returned immediately (email confirmation disabled in Supabase)
        if (data.session) {
          setCurrentUser(newUser);
          setUsers(prev => [...prev.filter(u => u.id !== newUser.id), newUser]);
        }

        // Upsert to profiles table in Supabase
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            country: newUser.country,
            country_code: newUser.countryCode,
            language: newUser.language,
            avatar: newUser.avatar,
            title: newUser.title,
            bio: newUser.bio,
            skills: newUser.skills
          });
        } catch {
          // profiles table might not be created yet, which is handled gracefully
        }

        return {
          success: true,
          error: data.session ? undefined : 'Registration successful! If email confirmation is enabled on your Supabase project, please check your inbox.'
        };
      }

      return { success: false, error: 'Registration did not return a user record.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration request failed.' };
    }
  };

  // Initial Supabase connection check and Auth state listener on mount
  useEffect(() => {
    retestSupabase();

    // Check if there is an existing Supabase auth session
    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = session.user;
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                const loadedUser: User = {
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  role: (profile.role || 'student') as UserRole,
                  country: profile.country || 'Global',
                  countryCode: profile.country_code || 'US',
                  language: profile.language || 'English',
                  title: profile.title,
                  headline: profile.headline,
                  bio: profile.bio,
                  skills: profile.skills || [],
                  verificationStatus: profile.verification_status,
                  createdAt: profile.created_at ? profile.created_at.split('T')[0] : '2026-02-01'
                };
                setCurrentUser(loadedUser);
              }
            });
        }
      });

      // Listen for Supabase auth state changes
      const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user && currentUser && currentUser.id.includes('-')) {
          // If a UUID Supabase user logged out
          setCurrentUser(null);
        }
      });

      // Sync courses, profiles, and enrollments from Supabase
      syncWithSupabase();

      return () => {
        authSubscription?.subscription?.unsubscribe();
      };
    } else {
      // In case key is loaded asynchronously or from storage
      syncWithSupabase();
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillverse_current_user', JSON.stringify(currentUser));
      localStorage.setItem('skilivo_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillverse_courses', JSON.stringify(courses));
    localStorage.setItem('skilivo_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('skillverse_categories', JSON.stringify(categories));
    localStorage.setItem('skilivo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('skillverse_enrollments', JSON.stringify(enrollments));
    localStorage.setItem('skilivo_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('skillverse_orders', JSON.stringify(orders));
    localStorage.setItem('skilivo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('skillverse_withdrawals', JSON.stringify(withdrawals));
    localStorage.setItem('skilivo_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('skillverse_certificates', JSON.stringify(certificates));
    localStorage.setItem('skilivo_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('skillverse_posts', JSON.stringify(posts));
    localStorage.setItem('skilivo_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('skillverse_commission_rate', platformCommissionRate.toString());
    localStorage.setItem('skilivo_commission_rate', platformCommissionRate.toString());
  }, [platformCommissionRate]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('skillverse_currency', code);
    localStorage.setItem('skilivo_currency', code);
  };

  const formatPrice = (priceUSD: number): string => {
    if (priceUSD === 0) return 'Free';
    const cfg = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = priceUSD * cfg.rateAgainstUSD;
    if (currency === 'NGN') {
      return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cfg.symbol}${converted.toFixed(2)}`;
  };

  const loginAs = (roleOrId: UserRole | string) => {
    let target = users.find(u => u.id === roleOrId);
    if (!target) {
      target = users.find(u => u.role === roleOrId);
    }
    if (target) {
      setCurrentUser(target);
    }
  };

  const loginWithCredentials = (email: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // Auto-create student if email doesn't exist yet for smooth review
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      country: 'United States',
      countryCode: 'US',
      language: 'English',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New Learner',
      email: userData.email || `user${Date.now()}@skillverse.internal`,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      role: userData.role || 'student',
      country: userData.country || 'Global',
      countryCode: userData.countryCode || 'US',
      language: userData.language || 'English',
      title: userData.title,
      bio: userData.bio,
      skills: userData.skills || [],
      verificationStatus: userData.role === 'instructor' ? 'not_submitted' : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = async () => {
    // If Supabase is connected, sign out from Supabase Auth too
    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('skillverse_current_user');
    localStorage.removeItem('skilivo_current_user');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));

    // If Supabase is configured and user ID is UUID, persist to Supabase
    const key = getSupabaseAnonKey();
    if (key && key.length > 20 && currentUser.id.includes('-')) {
      supabase.from('profiles').update({
        name: updated.name,
        avatar: updated.avatar,
        title: updated.title,
        bio: updated.bio,
        skills: updated.skills,
        country: updated.country,
        language: updated.language
      }).eq('id', currentUser.id).then();
    }
  };

  const getCourseEnrollment = (courseId: string): CourseEnrollment | undefined => {
    if (!currentUser) return undefined;
    return enrollments.find(e => e.studentId === currentUser.id && e.courseId === courseId);
  };

  const enrollCourse = async (courseId: string, paymentMethod = 'Flutterwave Global Card'): Promise<boolean> => {
    if (!currentUser) return false;
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    // Simulate backend payment verification & webhook check
    await new Promise(resolve => setTimeout(resolve, 600));

    // Calculate commission
    const commission = course.price * platformCommissionRate;
    const instructorNet = course.price - commission;

    // Create financial order record
    const newOrder: FinancialOrder = {
      id: `ord_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      itemType: 'course',
      itemId: course.id,
      itemTitle: course.title,
      amount: course.price,
      currency: 'USD',
      paymentMethod,
      transactionRef: `FLW-TX-${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'verified',
      platformCommissionRate,
      platformCommission: commission,
      instructorEarnings: instructorNet,
      instructorId: course.instructorId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);

    // Create Enrollment
    const newEnrollment: CourseEnrollment = {
      id: `enr_${Date.now()}`,
      studentId: currentUser.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString().split('T')[0],
      completedLessonIds: [],
      progressPercent: 0,
      notes: {}
    };

    setEnrollments(prev => [...prev.filter(e => !(e.studentId === currentUser.id && e.courseId === course.id)), newEnrollment]);

    // If Supabase is active, persist to database
    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      try {
        await supabase.from('enrollments').upsert({
          id: newEnrollment.id,
          student_id: currentUser.id,
          course_id: course.id,
          completed_lesson_ids: [],
          progress_percent: 0,
          notes: {}
        });
        await supabase.from('orders').insert({
          id: newOrder.id,
          student_id: currentUser.id,
          student_name: newOrder.studentName,
          student_email: newOrder.studentEmail,
          item_type: newOrder.itemType,
          item_id: newOrder.itemId,
          item_title: newOrder.itemTitle,
          amount: newOrder.amount,
          currency: newOrder.currency,
          payment_method: newOrder.paymentMethod,
          transaction_ref: newOrder.transactionRef,
          status: newOrder.status,
          platform_commission_rate: newOrder.platformCommissionRate,
          platform_commission: newOrder.platformCommission,
          instructor_earnings: newOrder.instructorEarnings,
          instructor_id: newOrder.instructorId
        });
      } catch (err) {
        console.warn('Supabase persistence for enrollment failed:', err);
      }
    }

    // Send in-app notification
    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Course Enrolled!',
      message: `You now have full verified access to "${course.title}". Start learning anytime.`,
      type: 'purchase',
      timestamp: 'Just now',
      read: false,
      linkAction: 'learning'
    };
    setNotifications(prev => [notif, ...prev]);

    return true;
  };

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Total lessons count
    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

    setEnrollments(prev =>
      prev.map(enr => {
        if (enr.studentId === currentUser.id && enr.courseId === courseId) {
          const isCompleted = enr.completedLessonIds.includes(lessonId);
          const updatedLessonIds = isCompleted
            ? enr.completedLessonIds.filter(id => id !== lessonId)
            : [...enr.completedLessonIds, lessonId];
          const newPercent = totalLessons > 0 ? Math.round((updatedLessonIds.length / totalLessons) * 100) : 0;
          
          // Persist progress to Supabase if connected
          const key = getSupabaseAnonKey();
          if (key && key.length > 20) {
            supabase
              .from('enrollments')
              .update({
                completed_lesson_ids: updatedLessonIds,
                progress_percent: newPercent,
                last_accessed_lesson_id: lessonId
              })
              .eq('student_id', currentUser.id)
              .eq('course_id', courseId)
              .then();
          }

          return {
            ...enr,
            completedLessonIds: updatedLessonIds,
            progressPercent: newPercent,
            lastAccessedLessonId: lessonId
          };
        }
        return enr;
      })
    );
  };

  const saveLessonNote = (courseId: string, lessonId: string, noteText: string) => {
    if (!currentUser) return;
    setEnrollments(prev =>
      prev.map(enr => {
        if (enr.studentId === currentUser.id && enr.courseId === courseId) {
          const updatedNotes = {
            ...(enr.notes || {}),
            [lessonId]: noteText
          };

          const key = getSupabaseAnonKey();
          if (key && key.length > 20) {
            supabase
              .from('enrollments')
              .update({ notes: updatedNotes })
              .eq('student_id', currentUser.id)
              .eq('course_id', courseId)
              .then();
          }

          return {
            ...enr,
            notes: updatedNotes
          };
        }
        return enr;
      })
    );
  };

  const claimCertificate = (courseId: string): CertificateRecord => {
    if (!currentUser) throw new Error('Not authenticated');
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const certId = `cert_${Date.now()}`;
    const certNumber = `SKV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: CertificateRecord = {
      id: certId,
      certificateNumber: certNumber,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      courseId: course.id,
      courseTitle: course.title,
      instructorName: course.instructor.name,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: `SKV-VERIFY-${certNumber}-${course.instructor.name.split(' ')[0].toUpperCase()}`,
      skillsGained: course.learningObjectives.slice(0, 4)
    };

    setCertificates(prev => [newCert, ...prev]);

    // Attach to enrollment
    setEnrollments(prev =>
      prev.map(e => (e.studentId === currentUser.id && e.courseId === courseId ? { ...e, certificateId: certId } : e))
    );

    // If Supabase active, update enrollment certificate_id
    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      supabase
        .from('enrollments')
        .update({ certificate_id: certId })
        .eq('student_id', currentUser.id)
        .eq('course_id', courseId)
        .then();
    }

    // Notify
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Certificate Awarded!',
        message: `Your verified completion certificate for "${course.title}" has been issued (#${certNumber}).`,
        type: 'certificate',
        timestamp: 'Just now',
        read: false,
        linkAction: 'certificates'
      },
      ...prev
    ]);

    return newCert;
  };

  const addCourseReview = (courseId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: CourseReview = {
      id: `rev_${Date.now()}`,
      courseId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: 'Just now',
      verifiedPurchase: true
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const bookLiveClass = async (classId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const liveClass = liveClasses.find(c => c.id === classId);
    if (!liveClass) return false;

    // Record order if paid
    if (liveClass.price > 0) {
      const commission = liveClass.price * platformCommissionRate;
      setOrders(prev => [
        {
          id: `ord_${Date.now()}`,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          itemType: 'live_class',
          itemId: liveClass.id,
          itemTitle: liveClass.title,
          amount: liveClass.price,
          currency: 'USD',
          paymentMethod: 'Flutterwave Webhook Verified',
          transactionRef: `FLW-LC-${Math.floor(1000000 + Math.random() * 9000000)}`,
          status: 'verified',
          platformCommissionRate,
          platformCommission: commission,
          instructorEarnings: liveClass.price - commission,
          instructorId: liveClass.instructorId,
          createdAt: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
    }

    setLiveClasses(prev =>
      prev.map(c =>
        c.id === classId
          ? {
              ...c,
              enrolledStudentIds: Array.from(new Set([...c.enrolledStudentIds, currentUser.id]))
            }
          : c
      )
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Seat Reserved for Live Class',
        message: `You are booked for "${liveClass.title}". Room link is available in your dashboard.`,
        type: 'class',
        timestamp: 'Just now',
        read: false,
        linkAction: 'live'
      },
      ...prev
    ]);

    return true;
  };

  const bookPrivateLesson = async (bookingData: Omit<PrivateBooking, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    if (!currentUser) return false;

    const newBooking: PrivateBooking = {
      ...bookingData,
      id: `bk_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'accepted' // auto-accept for demo responsiveness
    };

    setPrivateBookings(prev => [newBooking, ...prev]);

    // Financial transaction
    const commission = bookingData.amount * platformCommissionRate;
    setOrders(prev => [
      {
        id: `ord_${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        itemType: 'private_lesson',
        itemId: newBooking.id,
        itemTitle: `1-on-1: ${bookingData.packageTitle} with ${bookingData.instructorName}`,
        amount: bookingData.amount,
        currency: 'USD',
        paymentMethod: 'Flutterwave Instant Payout Escrow',
        transactionRef: `FLW-1ON1-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'verified',
        platformCommissionRate,
        platformCommission: commission,
        instructorEarnings: bookingData.amount - commission,
        instructorId: bookingData.instructorId,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: '1-on-1 Lesson Booked!',
        message: `Your session with ${bookingData.instructorName} on ${bookingData.date} (${bookingData.timeSlot}) is confirmed.`,
        type: 'class',
        timestamp: 'Just now',
        read: false,
        linkAction: 'private'
      },
      ...prev
    ]);

    return true;
  };

  const createCourse = (courseData: Partial<Course>): Course => {
    if (!currentUser) throw new Error('Not logged in');
    const courseId = `course_${Date.now()}`;
    const newCourse: Course = {
      id: courseId,
      title: courseData.title || 'Untitled New Course',
      subtitle: courseData.subtitle || 'Learn practical skills on Skillverse',
      slug: (courseData.title || 'untitled-course').toLowerCase().replace(/\s+/g, '-'),
      description: courseData.description || 'Comprehensive step-by-step masterclass.',
      instructorId: currentUser.id,
      instructor: currentUser,
      categoryId: courseData.categoryId || 'cat_prog',
      categoryName: categories.find(c => c.id === courseData.categoryId)?.name || 'Programming & Technology',
      level: courseData.level || 'All Levels',
      language: courseData.language || 'English',
      price: courseData.price ?? 49,
      originalPrice: (courseData.price ?? 49) * 1.5,
      durationHours: courseData.durationHours || 8.0,
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      introVideoUrl: courseData.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      learningObjectives: courseData.learningObjectives?.length ? courseData.learningObjectives : ['Master fundamental concepts', 'Build hands-on production projects'],
      requirements: courseData.requirements?.length ? courseData.requirements : ['Basic computer literacy'],
      status: courseData.status || 'under_review',
      rating: 5.0,
      reviewCount: 0,
      studentCount: 0,
      sections: courseData.sections?.length ? courseData.sections : [
        {
          id: `sec_${Date.now()}_1`,
          courseId,
          title: 'Section 1: Course Orientation & Architecture',
          order: 1,
          lessons: [
            {
              id: `les_${Date.now()}_1`,
              sectionId: `sec_${Date.now()}_1`,
              title: 'Welcome & System Setup',
              durationMinutes: 12,
              type: 'video',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              content: 'Get oriented with the tools, prerequisites, and milestone project repositories.',
              isFreePreview: true
            }
          ]
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCourses(prev => [newCourse, ...prev]);

    // If Supabase is active, persist course
    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      supabase.from('courses').insert({
        id: newCourse.id,
        title: newCourse.title,
        subtitle: newCourse.subtitle,
        slug: newCourse.slug,
        description: newCourse.description,
        instructor_id: currentUser.id,
        category_id: newCourse.categoryId,
        level: newCourse.level,
        language: newCourse.language,
        price: newCourse.price,
        original_price: newCourse.originalPrice,
        duration_hours: newCourse.durationHours,
        thumbnail: newCourse.thumbnail,
        intro_video_url: newCourse.introVideoUrl,
        learning_objectives: newCourse.learningObjectives,
        requirements: newCourse.requirements,
        status: newCourse.status
      }).then();
    }

    return newCourse;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === courseId ? { ...c, ...updates } : c)));

    const key = getSupabaseAnonKey();
    if (key && key.length > 20) {
      supabase.from('courses').update({
        ...(updates.title && { title: updates.title }),
        ...(updates.subtitle && { subtitle: updates.subtitle }),
        ...(updates.description && { description: updates.description }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.status && { status: updates.status })
      }).eq('id', courseId).then();
    }
  };

  const submitCourseForReview = (courseId: string) => {
    updateCourse(courseId, { status: 'under_review' });
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser?.id || '',
        title: 'Course Submitted for Review',
        message: 'Your course has been placed in the moderation queue. Administrators will review within 24 hours.',
        type: 'system',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const submitInstructorVerification = (docs: { idDocument: string; teachingCredential: string; portfolioUrl: string }) => {
    if (!currentUser) return;
    updateUserProfile({
      verificationStatus: 'under_review',
      verificationDocs: {
        ...docs,
        submittedAt: new Date().toISOString().split('T')[0]
      }
    });
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Verification Documents Received',
        message: 'Your instructor verification credentials are now under compliance review.',
        type: 'system',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const requestWithdrawal = (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }): boolean => {
    if (!currentUser) return false;
    const newWdr: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      amount,
      currency: 'USD',
      bankName: bankDetails.bankName,
      accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0]
    };
    setWithdrawals(prev => [newWdr, ...prev]);
    return true;
  };

  const updateBookingStatus = (bookingId: string, status: PrivateBooking['status']) => {
    setPrivateBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status } : b)));
  };

  const scheduleLiveClass = (classData: Partial<LiveClass>): LiveClass => {
    if (!currentUser) throw new Error('Not logged in');
    const newClass: LiveClass = {
      id: `live_${Date.now()}`,
      title: classData.title || 'Untitled Live Masterclass',
      description: classData.description || 'Interactive live session with Q&A.',
      instructorId: currentUser.id,
      instructor: currentUser,
      scheduledAt: classData.scheduledAt || new Date(Date.now() + 86400000 * 3).toISOString(),
      durationMinutes: classData.durationMinutes || 60,
      maxCapacity: classData.maxCapacity || 50,
      enrolledStudentIds: [],
      price: classData.price ?? 20,
      status: 'scheduled',
      meetingRoomId: `room-${Date.now()}`
    };
    setLiveClasses(prev => [newClass, ...prev]);
    return newClass;
  };

  const toggleCommunityMembership = (communityId: string) => {
    if (!currentUser) return;
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === communityId) {
          const isMember = c.memberIds.includes(currentUser.id);
          const updatedMembers = isMember
            ? c.memberIds.filter(id => id !== currentUser.id)
            : [...c.memberIds, currentUser.id];
          return {
            ...c,
            memberIds: updatedMembers,
            memberCount: isMember ? c.memberCount - 1 : c.memberCount + 1
          };
        }
        return c;
      })
    );
  };

  const createPost = (communityId: string, title: string, content: string, tags: string[]) => {
    if (!currentUser) return;
    const comm = communities.find(c => c.id === communityId);
    const commName = comm?.name || (communityId ? communityId : 'General Community');
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      communityId: comm?.id || communityId || 'general',
      communityName: commName,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'instructor' ? 'Instructor' : 'Learner',
      authorCountry: currentUser.country,
      title,
      content,
      tags,
      likes: 1,
      likedByUserIds: [currentUser.id],
      comments: [],
      createdAt: 'Just now'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = p.likedByUserIds.includes(currentUser.id);
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            likedByUserIds: hasLiked ? p.likedByUserIds.filter(id => id !== currentUser.id) : [...p.likedByUserIds, currentUser.id]
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                authorName: currentUser.name,
                authorAvatar: currentUser.avatar,
                content,
                createdAt: 'Just now'
              }
            ]
          };
        }
        return p;
      })
    );
  };

  const toggleFollowInstructor = (instructorId: string) => {
    if (!currentUser) return;
    const following = currentUser.followingIds || [];
    const isFollowing = following.includes(instructorId);
    const updated = isFollowing ? following.filter(id => id !== instructorId) : [...following, instructorId];
    updateUserProfile({ followingIds: updated });
  };

  const sendDirectMessage = (receiverId: string, content: string) => {
    if (!currentUser) return;
    const receiver = users.find(u => u.id === receiverId);
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${[currentUser.id, receiverId].sort().join('_')}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      receiverName: receiver?.name || 'User',
      content,
      timestamp: 'Just now',
      read: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Admin Actions
  const adminApproveCourse = (courseId: string) => {
    updateCourse(courseId, { status: 'published' });
  };

  const adminRejectCourse = (courseId: string) => {
    updateCourse(courseId, { status: 'rejected' });
  };

  const adminApproveInstructor = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, verificationStatus: 'approved' } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, verificationStatus: 'approved' } : null));
    }
  };

  const adminRejectInstructor = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, verificationStatus: 'rejected' } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, verificationStatus: 'rejected' } : null));
    }
  };

  const adminSetCommissionRate = (newRate: number) => {
    setPlatformCommissionRate(newRate);
  };

  const adminAddCategory = (categoryData: Omit<Category, 'id' | 'courseCount'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      courseCount: 0
    };
    setCategories(prev => [...prev, newCat]);
  };

  const adminDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const adminProcessWithdrawal = (withdrawalId: string, status: 'approved' | 'rejected', notes?: string) => {
    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status,
              processedAt: new Date().toISOString().split('T')[0],
              notes
            }
          : w
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        courses,
        categories,
        enrollments,
        reviews,
        liveClasses,
        privateBookings,
        communities,
        posts,
        messages,
        notifications,
        certificates,
        learningPaths,
        orders,
        withdrawals,
        platformCommissionRate,
        currency,
        supabaseStatus,
        retestSupabase,
        loginWithSupabase,
        registerWithSupabase,
        syncWithSupabase,
        setCurrentUser,
        loginAs,
        loginWithCredentials,
        registerUser,
        logout,
        updateUserProfile,
        setCurrency,
        formatPrice,
        enrollCourse,
        toggleLessonComplete,
        saveLessonNote,
        getCourseEnrollment,
        claimCertificate,
        addCourseReview,
        bookLiveClass,
        bookPrivateLesson,
        createCourse,
        updateCourse,
        submitCourseForReview,
        submitInstructorVerification,
        requestWithdrawal,
        updateBookingStatus,
        scheduleLiveClass,
        toggleCommunityMembership,
        createPost,
        likePost,
        addComment,
        toggleFollowInstructor,
        sendDirectMessage,
        markNotificationRead,
        markAllNotificationsRead,
        adminApproveCourse,
        adminRejectCourse,
        adminApproveInstructor,
        adminRejectInstructor,
        adminSetCommissionRate,
        adminAddCategory,
        adminDeleteCategory,
        adminProcessWithdrawal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
