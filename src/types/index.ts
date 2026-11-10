export type UserRole = 'student' | 'instructor' | 'admin';

export type VerificationStatus = 'not_submitted' | 'under_review' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  country: string;
  countryCode: string;
  language: string;
  title?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  hourlyRate?: number;
  verificationStatus?: VerificationStatus;
  verificationDocs?: {
    idDocument?: string;
    teachingCredential?: string;
    portfolioUrl?: string;
    submittedAt?: string;
  };
  followingIds?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  courseCount: number;
  isPopular?: boolean;
}

export interface LessonResource {
  id: string;
  title: string;
  fileType: 'pdf' | 'zip' | 'docx' | 'code';
  size: string;
  downloadUrl: string;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'text' | 'resource';
  videoUrl?: string;
  content?: string;
  resources?: LessonResource[];
  isFreePreview?: boolean;
}

export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  instructorId: string;
  instructor: User;
  categoryId: string;
  categoryName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  price: number; // in USD
  originalPrice?: number;
  durationHours: number;
  thumbnail: string;
  introVideoUrl?: string;
  learningObjectives: string[];
  requirements: string[];
  status: 'draft' | 'under_review' | 'published' | 'rejected';
  rating: number;
  reviewCount: number;
  studentCount: number;
  isFeatured?: boolean;
  sections: CourseSection[];
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  progressPercent: number;
  lastAccessedLessonId?: string;
  certificateId?: string;
  notes?: Record<string, string>; // lessonId -> note string
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructor: User;
  scheduledAt: string;
  durationMinutes: number;
  maxCapacity: number;
  enrolledStudentIds: string[];
  price: number; // 0 for free
  status: 'scheduled' | 'live' | 'completed';
  meetingRoomId: string;
}

export interface LessonPackage {
  id: string;
  title: string;
  hours: number;
  price: number;
  description: string;
}

export interface PrivateBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  instructorId: string;
  instructorName: string;
  date: string;
  timeSlot: string;
  packageTitle: string;
  amount: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  memberCount: number;
  iconName: string;
  bannerGradient: string;
  memberIds: string[];
}

export interface CommunityPost {
  id: string;
  communityId: string;
  communityName: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorCountry: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  likedByUserIds: string[];
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'purchase' | 'class' | 'message' | 'certificate' | 'system' | 'review' | 'withdrawal';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export interface LearningPathStage {
  stageNumber: number;
  title: string;
  description: string;
  courseIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedWeeks: number;
  stages: LearningPathStage[];
  enrolledStudentIds: string[];
}

export interface FinancialOrder {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  itemType: 'course' | 'live_class' | 'private_lesson';
  itemId: string;
  itemTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionRef: string;
  status: 'pending' | 'verified' | 'failed';
  platformCommissionRate: number; // e.g. 0.15
  platformCommission: number;
  instructorEarnings: number;
  instructorId: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  currency: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string; // e.g. SKV-2026-9041
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  verificationCode: string;
  skillsGained: string[];
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number; // multiplier from USD
}
