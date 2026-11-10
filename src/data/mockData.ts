import {
  User,
  Category,
  Course,
  Community,
  CommunityPost,
  LiveClass,
  LearningPath,
  CertificateRecord,
  CurrencyConfig
} from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateAgainstUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', rateAgainstUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rateAgainstUSD: 0.79 },
  NGN: { code: 'NGN', symbol: '₦', rateAgainstUSD: 1450 },
  CAD: { code: 'CAD', symbol: 'CA$', rateAgainstUSD: 1.36 }
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_student_1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'student',
    country: 'United Kingdom',
    countryCode: 'GB',
    language: 'English',
    headline: 'Aspiring Full-Stack Software Engineer & Tech Enthusiast',
    bio: 'Passionate about modern software architecture, generative AI systems, and interactive learning. Currently sharpening frontend and distributed backend skills.',
    followingIds: ['user_inst_1', 'user_inst_2'],
    createdAt: '2026-01-15'
  },
  {
    id: 'user_inst_1',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@skillverse-faculty.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    role: 'instructor',
    country: 'Germany',
    countryCode: 'DE',
    language: 'English, German',
    title: 'Senior AI Fellow & Applied ML Researcher',
    headline: 'Former Principal ML Engineer at Munich AI Labs · PhD in Computer Vision',
    bio: 'Elena has dedicated 12+ years to bridging foundational AI mathematics with production-grade generative models. She advises international engineering teams and loves demystifying complex neural architectures.',
    skills: ['Artificial Intelligence', 'PyTorch', 'Transformers', 'MLOps', 'Vector Search'],
    rating: 4.96,
    reviewCount: 1420,
    studentCount: 18450,
    hourlyRate: 140,
    verificationStatus: 'approved',
    verificationDocs: {
      idDocument: 'Passport_DE_verified.pdf',
      teachingCredential: 'PhD_Doctorate_ML_Munich.pdf',
      portfolioUrl: 'https://rostova-research.de',
      submittedAt: '2026-01-10'
    },
    createdAt: '2025-11-01'
  },
  {
    id: 'user_inst_2',
    name: 'Amara Okafor',
    email: 'amara.okafor@skillverse-faculty.org',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    role: 'instructor',
    country: 'Nigeria',
    countryCode: 'NG',
    language: 'English, Yoruba',
    title: 'Principal Cloud Architect & Distributed Systems Lead',
    headline: 'Fintech Infrastructure Specialist · Cloud Architecture Consultant',
    bio: 'Amara designs high-throughput transaction engines and resilient cloud backends across African and European fintech hubs. He focuses on practical, fault-tolerant software engineering and hands-on coding.',
    skills: ['Cloud Architecture', 'Go', 'Distributed Systems', 'PostgreSQL', 'Docker/K8s', 'React'],
    rating: 4.92,
    reviewCount: 980,
    studentCount: 14200,
    hourlyRate: 110,
    verificationStatus: 'approved',
    verificationDocs: {
      idDocument: 'NIN_Identity_Verified.pdf',
      teachingCredential: 'AWS_Solutions_Architect_Professional.pdf',
      portfolioUrl: 'https://amaraokafor.tech',
      submittedAt: '2025-12-14'
    },
    createdAt: '2025-10-18'
  },
  {
    id: 'user_inst_3',
    name: 'Mateo Silva',
    email: 'mateo.silva@skillverse-faculty.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'instructor',
    country: 'Brazil',
    countryCode: 'BR',
    language: 'English, Portuguese, Spanish',
    title: 'Creative Director & Brand Systems Strategist',
    headline: 'Award-winning Product & Motion Designer · Cannes Lions Juror',
    bio: 'With over 14 years shaping design languages for tech companies across the Americas, Mateo teaches end-to-end design craft: from typography and Figma systems to interactive web experiences.',
    skills: ['UI/UX Design', 'Design Systems', 'Motion Design', 'Brand Identity', 'Figma'],
    rating: 4.88,
    reviewCount: 760,
    studentCount: 9800,
    hourlyRate: 95,
    verificationStatus: 'approved',
    verificationDocs: {
      idDocument: 'NationalID_BR_Verified.pdf',
      teachingCredential: 'FineArts_BA_Design_Curitiba.pdf',
      portfolioUrl: 'https://mateosilva.design',
      submittedAt: '2026-01-05'
    },
    createdAt: '2025-12-01'
  },
  {
    id: 'user_inst_4',
    name: 'Sophia Chen',
    email: 'sophia.chen@skillverse-faculty.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    role: 'instructor',
    country: 'Canada',
    countryCode: 'CA',
    language: 'English, Mandarin',
    title: 'VP of Growth & International Expansion Advisor',
    headline: 'Ex-Stripe Growth Lead · Seed-to-Series B Startup Mentor',
    bio: 'Sophia mentors founders and marketing leads globally on scalable customer acquisition, lifecycle loops, and multi-market localization strategies.',
    skills: ['Growth Marketing', 'Product Analytics', 'B2B SaaS', 'Performance Marketing', 'SEO'],
    rating: 4.95,
    reviewCount: 640,
    studentCount: 7900,
    hourlyRate: 130,
    verificationStatus: 'approved',
    verificationDocs: {
      idDocument: 'Passport_CA_Verified.pdf',
      teachingCredential: 'MBA_Rotman_Toronto.pdf',
      portfolioUrl: 'https://sophiachen.growth',
      submittedAt: '2025-11-20'
    },
    createdAt: '2025-09-12'
  },
  {
    id: 'user_admin_1',
    name: 'Skillverse Admin Control',
    email: 'admin@skillverse.internal',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    country: 'Global Operations',
    countryCode: 'UN',
    language: 'English',
    headline: 'Chief Governance & Platform Compliance Officer',
    createdAt: '2025-08-01'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat_ai',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Generative models, LLMs, neural networks, computer vision, and prompt engineering.',
    iconName: 'BrainCircuit',
    courseCount: 42,
    isPopular: true
  },
  {
    id: 'cat_prog',
    name: 'Programming & Technology',
    slug: 'programming-technology',
    description: 'Python, TypeScript, Go, Rust, distributed systems, and algorithmic problem-solving.',
    iconName: 'Code',
    courseCount: 56,
    isPopular: true
  },
  {
    id: 'cat_web',
    name: 'Website Development',
    slug: 'website-development',
    description: 'React, Next.js, modern CSS, backend APIs, GraphQL, and modern web deployment.',
    iconName: 'Globe',
    courseCount: 68,
    isPopular: true
  },
  {
    id: 'cat_design',
    name: 'Graphic Design & UI/UX',
    slug: 'graphic-design',
    description: 'Design systems, Figma mastery, product psychology, branding, and typography.',
    iconName: 'Palette',
    courseCount: 38,
    isPopular: true
  },
  {
    id: 'cat_video',
    name: 'Video Editing & Motion',
    slug: 'video-editing',
    description: 'Premiere Pro, DaVinci Resolve, After Effects, storytelling, and color grading.',
    iconName: 'Film',
    courseCount: 29,
    isPopular: true
  },
  {
    id: 'cat_marketing',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'SEO, performance ad campaigns, email funnels, conversion optimization, and analytics.',
    iconName: 'TrendingUp',
    courseCount: 44,
    isPopular: true
  },
  {
    id: 'cat_biz',
    name: 'Business & Entrepreneurship',
    slug: 'business-entrepreneurship',
    description: 'Startup finance, fundraising, pitch decks, market validation, and leadership.',
    iconName: 'Briefcase',
    courseCount: 51,
    isPopular: true
  },
  {
    id: 'cat_photo',
    name: 'Photography',
    slug: 'photography',
    description: 'Studio lighting, portraiture, commercial product shoots, and Lightroom editing.',
    iconName: 'Camera',
    courseCount: 22
  },
  {
    id: 'cat_fashion',
    name: 'Fashion & Tailoring',
    slug: 'fashion-tailoring',
    description: 'Pattern drafting, garment construction, textile selection, and fashion illustration.',
    iconName: 'Scissors',
    courseCount: 18
  },
  {
    id: 'cat_lang',
    name: 'Languages',
    slug: 'languages',
    description: 'Business English, Spanish, Mandarin, French, German, and conversational fluency.',
    iconName: 'Languages',
    courseCount: 35
  },
  {
    id: 'cat_acad',
    name: 'Education & Academics',
    slug: 'education-academics',
    description: 'Applied mathematics, physics, statistics, scientific writing, and research methods.',
    iconName: 'GraduationCap',
    courseCount: 27
  },
  {
    id: 'cat_culinary',
    name: 'Cooking & Culinary Skills',
    slug: 'cooking-culinary',
    description: 'Artisan baking, international gastronomy, knife skills, and food safety standards.',
    iconName: 'Utensils',
    courseCount: 21
  },
  {
    id: 'cat_music',
    name: 'Music & Creative Arts',
    slug: 'music-creative-arts',
    description: 'Music production in Ableton, audio engineering, songwriting, and creative writing.',
    iconName: 'Music',
    courseCount: 25
  },
  {
    id: 'cat_pers_dev',
    name: 'Personal Development',
    slug: 'personal-development',
    description: 'Public speaking, productivity frameworks, negotiation, and cognitive resilience.',
    iconName: 'Compass',
    courseCount: 39
  },
  {
    id: 'cat_vocational',
    name: 'Practical & Vocational Skills',
    slug: 'practical-vocational-skills',
    description: 'Electrical installations, plumbing essentials, renewable energy, and carpentry.',
    iconName: 'Wrench',
    courseCount: 19
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course_ai_101',
    title: 'Deep Learning & Generative AI Systems: From Math to Production',
    subtitle: 'Build, fine-tune, and deploy transformer architectures and vector-grounded LLM systems.',
    slug: 'deep-learning-generative-ai-production',
    description: 'An exhaustive masterclass designed for engineers who want to move beyond consumer prompts into actual production AI systems. Learn the linear algebra of attention mechanisms, multi-head transformer construction, parameter-efficient fine-tuning (LoRA), vector embeddings, and low-latency inference pipelines.',
    instructorId: 'user_inst_1',
    instructor: MOCK_USERS[1],
    categoryId: 'cat_ai',
    categoryName: 'Artificial Intelligence',
    level: 'Advanced',
    language: 'English',
    price: 89,
    originalPrice: 149,
    durationHours: 24.5,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Implement multi-head self-attention from scratch in PyTorch',
      'Deploy production vector databases (Pinecone, pgvector) with hybrid BM25 search',
      'Fine-tune open-weight models using QLoRA with custom domain datasets',
      'Optimize latency with vLLM, TensorRT-LLM, and speculative decoding',
      'Build resilient agentic evaluation frameworks with automated hallucination checks'
    ],
    requirements: [
      'Intermediate Python fluency (OOP, asynchronous syntax)',
      'Basic linear algebra and calculus fundamentals',
      'Laptop with GPU access or Google Colab / Kaggle environment'
    ],
    status: 'published',
    rating: 4.96,
    reviewCount: 382,
    studentCount: 4210,
    isFeatured: true,
    createdAt: '2025-11-20',
    sections: [
      {
        id: 'sec_ai_1',
        courseId: 'course_ai_101',
        title: 'Foundations of Modern Attention Mechanisms',
        order: 1,
        lessons: [
          {
            id: 'les_ai_1_1',
            sectionId: 'sec_ai_1',
            title: 'The Evolution of Neural Encoders: From RNNs to Transformers',
            durationMinutes: 18,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            content: 'In this introductory lesson, Dr. Elena Rostova analyzes the bottleneck of recurrence and reveals why parallelized attention changed deep learning forever.',
            isFreePreview: true,
            resources: [
              {
                id: 'res_ai_1',
                title: 'Mathematical Derivation of Scaled Dot-Product Attention (PDF)',
                fileType: 'pdf',
                size: '2.4 MB',
                downloadUrl: '#'
              }
            ]
          },
          {
            id: 'les_ai_1_2',
            sectionId: 'sec_ai_1',
            title: 'Implementing Scaled Dot-Product Attention in Pure PyTorch',
            durationMinutes: 28,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content: 'Step-by-step coding walk-through building Query, Key, and Value projection matrices and calculating softmax weights with causal masking.',
            isFreePreview: false,
            resources: [
              {
                id: 'res_ai_2',
                title: 'attention_matrix_notebook.ipynb',
                fileType: 'code',
                size: '145 KB',
                downloadUrl: '#'
              }
            ]
          },
          {
            id: 'les_ai_1_3',
            sectionId: 'sec_ai_1',
            title: 'Positional Encodings: Sinusoidal vs. RoPE (Rotary Position Embeddings)',
            durationMinutes: 22,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            content: 'Understand rotational coordinate transformations and how modern models like LLaMA and Mistral preserve relative token distances across long contexts.',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'sec_ai_2',
        courseId: 'course_ai_101',
        title: 'Production RAG Architectures & Vector Retrieval',
        order: 2,
        lessons: [
          {
            id: 'les_ai_2_1',
            sectionId: 'sec_ai_2',
            title: 'Chunking Strategies, Chunk Overlap & Semantic Boundary Detection',
            durationMinutes: 25,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            content: 'Avoid information loss at sentence boundaries. Master recursive character splitting, markdown AST chunking, and semantic token grouping.',
            isFreePreview: false
          },
          {
            id: 'les_ai_2_2',
            sectionId: 'sec_ai_2',
            title: 'Hybrid Dense-Sparse Retrieval with Reciprocal Rank Fusion',
            durationMinutes: 34,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            content: 'Combine BM25 keyword matching with dense embedding dot products to achieve high recall on technical documentation.',
            isFreePreview: false
          }
        ]
      }
    ]
  },
  {
    id: 'course_web_201',
    title: 'Modern Full-Stack Web Architecture: React 19, TypeScript & Cloud Scale',
    subtitle: 'From modular frontend design systems to resilient distributed Node.js microservices.',
    slug: 'modern-full-stack-web-architecture',
    description: 'A complete real-world engineering curriculum crafted by Principal Cloud Architect Amara Okafor. Master React 19 hooks and server components, state synchronization, relational SQL schema migrations, atomic transactions, authentication flows, caching layers, and CI/CD pipelines.',
    instructorId: 'user_inst_2',
    instructor: MOCK_USERS[2],
    categoryId: 'cat_web',
    categoryName: 'Website Development',
    level: 'Intermediate',
    language: 'English',
    price: 75,
    originalPrice: 120,
    durationHours: 32.0,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Master React 19 architecture, custom hooks, and concurrent features',
      'Design normalized PostgreSQL database schemas with Drizzle and Prisma ORM',
      'Implement real-time updates via WebSockets and Server-Sent Events',
      'Build secure OAuth 2.0 and JWT token rotation with HTTP-only cookies',
      'Containerize multi-container architectures with Docker Compose & Nginx reverse proxies'
    ],
    requirements: [
      'Basic HTML, CSS, and modern JavaScript (ES6+)',
      'Familiarity with terminal commands and Git basics'
    ],
    status: 'published',
    rating: 4.93,
    reviewCount: 512,
    studentCount: 6380,
    isFeatured: true,
    createdAt: '2025-10-15',
    sections: [
      {
        id: 'sec_web_1',
        courseId: 'course_web_201',
        title: 'High-Performance React Architecture',
        order: 1,
        lessons: [
          {
            id: 'les_web_1_1',
            sectionId: 'sec_web_1',
            title: 'Mental Models: State Colocation, Reconciliation, and Render Trees',
            durationMinutes: 20,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            content: 'Avoid premature optimization and unnecessary global re-renders. Learn exact component boundary isolation techniques.',
            isFreePreview: true,
            resources: [
              {
                id: 'res_web_1',
                title: 'Architecture Blueprint & Component Checklist (PDF)',
                fileType: 'pdf',
                size: '1.8 MB',
                downloadUrl: '#'
              }
            ]
          },
          {
            id: 'les_web_1_2',
            sectionId: 'sec_web_1',
            title: 'TypeScript Generics & Strict Type-Safe Component Contracts',
            durationMinutes: 30,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            content: 'Write foolproof reusable UI components with polymorphic types, Discriminated Unions, and custom forwardRefs.',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'sec_web_2',
        courseId: 'course_web_201',
        title: 'Backend Systems, Database Relational Design & Auth',
        order: 2,
        lessons: [
          {
            id: 'les_web_2_1',
            sectionId: 'sec_web_2',
            title: 'PostgreSQL Relational Normalization & High-Traffic Indexing',
            durationMinutes: 35,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            content: 'Foreign keys, composite B-tree indices, partial indexing, and query plan execution analysis with EXPLAIN ANALYZE.',
            isFreePreview: false
          }
        ]
      }
    ]
  },
  {
    id: 'course_design_301',
    title: 'Visual Brand Identity & Advanced UI/UX Design Masterclass',
    subtitle: 'Craft cohesive design systems, typographic scales, and micro-interactions in Figma.',
    slug: 'visual-brand-identity-uiux-masterclass',
    description: 'Transform your design work into world-class digital products. Mateo Silva breaks down brand strategy, visual hierarchy, fluid spatial math, color contrast accessibility, and component token pipelines in Figma.',
    instructorId: 'user_inst_3',
    instructor: MOCK_USERS[3],
    categoryId: 'cat_design',
    categoryName: 'Graphic Design & UI/UX',
    level: 'All Levels',
    language: 'English',
    price: 65,
    originalPrice: 110,
    durationHours: 18.5,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Build scalable multi-brand design tokens (color, spacing, elevation) in Figma',
      'Master typography hierarchy, font pairings, and responsive fluid type scales',
      'Create interactive interactive prototypes with smart animates and variables',
      'Conduct user testing and synthesize actionable heuristics'
    ],
    requirements: [
      'Free Figma account',
      'Curiosity for visual aesthetics and human-computer interaction'
    ],
    status: 'published',
    rating: 4.89,
    reviewCount: 290,
    studentCount: 3120,
    isFeatured: true,
    createdAt: '2025-12-05',
    sections: [
      {
        id: 'sec_des_1',
        courseId: 'course_design_301',
        title: 'Design Principles & Typographic Mastery',
        order: 1,
        lessons: [
          {
            id: 'les_des_1_1',
            sectionId: 'sec_des_1',
            title: 'Optical Balance, Spatial Rhythm, and Negative Space',
            durationMinutes: 22,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            content: 'How top international studios establish effortless visual hierarchy without cluttered decorative boxes.',
            isFreePreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course_mkt_401',
    title: 'Global Growth Marketing: International Scaling & Acquisition Engines',
    subtitle: 'Data-driven growth frameworks, international CAC optimization, and retention loops.',
    slug: 'global-growth-marketing-international-scaling',
    description: 'Learn how modern international startups acquire millions of active users sustainably without burning endless ad budgets. Sophia Chen teaches product-led acquisition, viral loops, multi-currency pricing experiments, and attribution models.',
    instructorId: 'user_inst_4',
    instructor: MOCK_USERS[4],
    categoryId: 'cat_marketing',
    categoryName: 'Digital Marketing',
    level: 'Intermediate',
    language: 'English',
    price: 80,
    originalPrice: 135,
    durationHours: 16.0,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Set up full-funnel multi-touch attribution with PostHog and Google Analytics 4',
      'Design high-converting landing pages backed by statistical A/B testing',
      'Build localized international ad campaigns across European, African, and Asian markets',
      'Formulate retention cohorts and net revenue retention (NRR) benchmarks'
    ],
    requirements: [
      'Basic understanding of marketing channels or business concepts'
    ],
    status: 'published',
    rating: 4.94,
    reviewCount: 215,
    studentCount: 2840,
    isFeatured: false,
    createdAt: '2025-11-10',
    sections: [
      {
        id: 'sec_mkt_1',
        courseId: 'course_mkt_401',
        title: 'Growth Architecture & Funnel Economics',
        order: 1,
        lessons: [
          {
            id: 'les_mkt_1_1',
            sectionId: 'sec_mkt_1',
            title: 'Deconstructing Unit Economics: LTV, CAC, Payback Windows',
            durationMinutes: 24,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content: 'Understand why cash flow timing matters as much as nominal LTV/CAC ratios when expanding globally.',
            isFreePreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course_video_501',
    title: 'Commercial Cinematography & Story-Driven Video Editing',
    subtitle: 'From camera sensors and lighting ratios to DaVinci Resolve color grading.',
    slug: 'commercial-cinematography-video-editing',
    description: 'Learn visual storytelling that commands high commercial budgets. Discover lighting setups, focal length psychology, sound design layering, and professional color management pipelines.',
    instructorId: 'user_inst_3',
    instructor: MOCK_USERS[3],
    categoryId: 'cat_video',
    categoryName: 'Video Editing & Motion',
    level: 'Beginner',
    language: 'English',
    price: 59,
    originalPrice: 95,
    durationHours: 14.5,
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Master the 3-point lighting setup and color contrast ratios',
      'Edit narrative pacing and audio dynamics in DaVinci Resolve / Premiere',
      'Apply color science (ACES, Rec.709, log profiles) with precision LUTs'
    ],
    requirements: [
      'Computer capable of basic video playback and editing',
      'Any camera or smartphone with manual video controls'
    ],
    status: 'published',
    rating: 4.87,
    reviewCount: 180,
    studentCount: 1950,
    isFeatured: false,
    createdAt: '2025-12-18',
    sections: [
      {
        id: 'sec_vid_1',
        courseId: 'course_video_501',
        title: 'Cinematic Visual Composition',
        order: 1,
        lessons: [
          {
            id: 'les_vid_1_1',
            sectionId: 'sec_vid_1',
            title: 'Framing, Depth of Field, and Eye-Line Pacing',
            durationMinutes: 19,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            content: 'How composition primes emotional resonance before a single line of dialogue is spoken.',
            isFreePreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course_cloud_601',
    title: 'Enterprise Microservices with Go & Distributed Systems',
    subtitle: 'Construct high-throughput gRPC services, event-driven messaging, and resilient clusters.',
    slug: 'enterprise-microservices-go-distributed',
    description: 'A deep-dive engineering program exploring asynchronous event buses with Kafka, gRPC protocol buffers, distributed tracing with OpenTelemetry, and container orchestration.',
    instructorId: 'user_inst_2',
    instructor: MOCK_USERS[2],
    categoryId: 'cat_prog',
    categoryName: 'Programming & Technology',
    level: 'Advanced',
    language: 'English',
    price: 95,
    originalPrice: 160,
    durationHours: 26.0,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Write idiomatic, high-concurrency Go programs with goroutines and channels',
      'Design schema-first APIs with Protocol Buffers and gRPC streaming',
      'Handle split-brain scenarios and data consistency using Saga patterns',
      'Implement distributed rate limiting with Redis sliding-window algorithms'
    ],
    requirements: [
      'Working knowledge of any backend language (Go, Python, Java, or Node.js)'
    ],
    status: 'published',
    rating: 4.97,
    reviewCount: 340,
    studentCount: 3820,
    isFeatured: false,
    createdAt: '2025-09-30',
    sections: [
      {
        id: 'sec_cld_1',
        courseId: 'course_cloud_601',
        title: 'Go Concurrency Foundations',
        order: 1,
        lessons: [
          {
            id: 'les_cld_1_1',
            sectionId: 'sec_cld_1',
            title: 'Memory Models, Race Detectors, and Safe Worker Pools',
            durationMinutes: 27,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            content: 'Practical concurrency patterns that prevent memory leaks and goroutine starvation under production load.',
            isFreePreview: true
          }
        ]
      }
    ]
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm_ai',
    name: 'Artificial Intelligence & Data Systems',
    slug: 'ai-data-systems',
    description: 'A global network of machine learning practitioners, researchers, and prompt engineers sharing discoveries and troubleshooting neural models.',
    category: 'Artificial Intelligence',
    memberCount: 8420,
    iconName: 'BrainCircuit',
    bannerGradient: 'from-indigo-600 to-purple-700',
    memberIds: ['user_student_1', 'user_inst_1']
  },
  {
    id: 'comm_web',
    name: 'Modern Full-Stack Developers',
    slug: 'fullstack-developers',
    description: 'Engineers building scalable web products with TypeScript, React, Next.js, Go, Rust, and modern database architectures.',
    category: 'Website Development',
    memberCount: 12600,
    iconName: 'Code',
    bannerGradient: 'from-cyan-600 to-blue-700',
    memberIds: ['user_student_1', 'user_inst_2']
  },
  {
    id: 'comm_design',
    name: 'UI/UX & Product Design Collective',
    slug: 'design-collective',
    description: 'Designers discussing user research, design systems, Figma workflows, motion design, and product psychology.',
    category: 'Graphic Design & UI/UX',
    memberCount: 7150,
    iconName: 'Palette',
    bannerGradient: 'from-purple-600 to-pink-600',
    memberIds: ['user_inst_3']
  },
  {
    id: 'comm_growth',
    name: 'Startup Growth & International Scaling',
    slug: 'growth-scaling',
    description: 'Founders and growth operators dissecting international customer acquisition, product-led loops, and retention strategies.',
    category: 'Digital Marketing',
    memberCount: 5890,
    iconName: 'TrendingUp',
    bannerGradient: 'from-emerald-600 to-teal-700',
    memberIds: ['user_inst_4']
  }
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    communityId: 'comm_ai',
    communityName: 'Artificial Intelligence & Data Systems',
    authorId: 'user_inst_1',
    authorName: 'Dr. Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorRole: 'Instructor · Munich, Germany',
    authorCountry: 'Germany',
    title: 'Key takeaways from scaling vector indexing across 10 million embeddings',
    content: "When benchmarked against real user traffic, flat indices inevitably degrade in throughput once embedding dimensionality passes 1536. We compared HNSW (Hierarchical Navigable Small World) with IVFPQ (Inverted File with Product Quantization). Key finding: configuring efSearch=64 provided 98.4% recall while cutting p99 latency from 142ms down to 18ms. Here are three architectural rules we now enforce in our lab...",
    tags: ['VectorDB', 'MachineLearning', 'LatencyOptimization', 'HNSW'],
    likes: 84,
    likedByUserIds: ['user_student_1'],
    comments: [
      {
        id: 'c_1',
        authorName: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        content: 'This matches what I noticed in the lab exercises! Did you notice any memory overhead spikes during dynamic re-indexing?',
        createdAt: '2 hours ago'
      },
      {
        id: 'c_2',
        authorName: 'Amara Okafor',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        content: 'Spot on, Elena. We observed identical behavior in our PostgreSQL pgvector benchmarks when configuring lists=1000 on IVF.',
        createdAt: '1 hour ago'
      }
    ],
    createdAt: '4 hours ago'
  },
  {
    id: 'post_2',
    communityId: 'comm_web',
    communityName: 'Modern Full-Stack Developers',
    authorId: 'user_inst_2',
    authorName: 'Amara Okafor',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    authorRole: 'Instructor · Lagos, Nigeria',
    authorCountry: 'Nigeria',
    title: 'Why we should favor atomic database transactions over distributed client multi-calls',
    content: "Too often in junior code reviews, I see developers making three sequential REST calls from the client to deduct a wallet balance, record an order, and send an email. If step two fails due to a network glitch, you have orphaned funds. Always encapsulate critical state changes inside single-database atomic transactions (BEGIN/COMMIT). Keep network RPCs out of transaction locks!",
    tags: ['Architecture', 'PostgreSQL', 'Fintech', 'BestPractices'],
    likes: 126,
    likedByUserIds: [],
    comments: [
      {
        id: 'c_3',
        authorName: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        content: 'Invaluable tip. Exactly what was covered in Section 2 of your Cloud Architecture course.',
        createdAt: '3 hours ago'
      }
    ],
    createdAt: '7 hours ago'
  }
];

export const MOCK_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live_1',
    title: 'Live Workshop: Fine-Tuning LLaMA-3 with Custom Datasets in Google Colab',
    description: 'An interactive hands-on session with Dr. Elena Rostova. Bring your Jupyter environment — we will walk through dataset cleansing, tokenization, LoRA hyperparameters, and export.',
    instructorId: 'user_inst_1',
    instructor: MOCK_USERS[1],
    scheduledAt: '2026-11-12T17:00:00Z',
    durationMinutes: 90,
    maxCapacity: 60,
    enrolledStudentIds: ['user_student_1'],
    price: 25,
    status: 'scheduled',
    meetingRoomId: 'room-ai-llama-tune'
  },
  {
    id: 'live_2',
    title: 'Live Architectural Teardown: Building Fault-Tolerant Payment Pipelines',
    description: 'Join Amara Okafor for a real-time system design session covering idempotency keys, webhook retry backoff exponential strategies, and ledger reconciliation.',
    instructorId: 'user_inst_2',
    instructor: MOCK_USERS[2],
    scheduledAt: '2026-11-15T15:00:00Z',
    durationMinutes: 75,
    maxCapacity: 50,
    enrolledStudentIds: [],
    price: 0,
    status: 'scheduled',
    meetingRoomId: 'room-fintech-systems'
  }
];

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path_web_architect',
    title: 'Full-Stack Web Architect Path',
    description: 'A structured 10-stage progression guiding learners from foundational internet protocols to scalable cloud infrastructure and production deployment.',
    category: 'Website Development',
    level: 'Comprehensive (Beginner to Senior)',
    estimatedWeeks: 24,
    enrolledStudentIds: ['user_student_1'],
    stages: [
      {
        stageNumber: 1,
        title: 'Stage 1: Web Protocols & Modern TypeScript Fundamentals',
        description: 'Understand HTTP/3, TCP/IP, modern ES2026 syntax, and strict TypeScript types.',
        courseIds: ['course_web_201']
      },
      {
        stageNumber: 2,
        title: 'Stage 2: Advanced Reactive Component Architecture',
        description: 'Master component composition, atomic state, and performance profiling.',
        courseIds: ['course_web_201']
      },
      {
        stageNumber: 3,
        title: 'Stage 3: Relational Database Modeling & Indexing',
        description: 'PostgreSQL schema normalization, indexing, connection pooling, and migrations.',
        courseIds: ['course_cloud_601']
      },
      {
        stageNumber: 4,
        title: 'Stage 4: Cloud Infrastructure & Container Orchestration',
        description: 'Containerization, CI/CD automated test suites, and multi-region deployment.',
        courseIds: ['course_cloud_601']
      }
    ]
  },
  {
    id: 'path_ai_engineer',
    title: 'Generative AI & LLM Systems Engineer',
    description: 'Journey from mathematical linear algebra fundamentals to building production-ready autonomous agent pipelines and RAG vector search engines.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    estimatedWeeks: 20,
    enrolledStudentIds: [],
    stages: [
      {
        stageNumber: 1,
        title: 'Stage 1: Deep Learning & Attention Foundations',
        description: 'Matrix multiplication, backpropagation, and transformer architectures.',
        courseIds: ['course_ai_101']
      },
      {
        stageNumber: 2,
        title: 'Stage 2: Vector Search & Hybrid Retrieval Systems',
        description: 'Embeddings, vector databases, reranking, and semantic chunking.',
        courseIds: ['course_ai_101']
      }
    ]
  }
];

export const SAMPLE_TESTIMONIALS = [
  {
    id: 'test_1',
    name: 'Tariq Al-Mansoor',
    role: 'Full-Stack Engineer',
    location: 'United Arab Emirates',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    comment: 'SKILLVERSE’s live classroom and 1-on-1 mentor sessions transformed my software engineering career. Learning directly from practitioners who deploy real systems makes all the difference.'
  },
  {
    id: 'test_2',
    name: 'Chioma Adebayo',
    role: 'Product Designer',
    location: 'Nigeria',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    comment: 'The community aspect separates SKILLVERSE from ordinary course sites. You collaborate on projects with peers from 30+ countries and get genuine portfolio critiques.'
  },
  {
    id: 'test_3',
    name: 'Lucas Weber',
    role: 'ML Ops Specialist',
    location: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    comment: 'Dr. Rostova’s course gave our engineering team the exact blueprint we needed to optimize our vector search cluster. Worth tenfold the enrollment fee.'
  }
];

export const INITIAL_SAMPLE_CERTIFICATE: CertificateRecord = {
  id: 'cert_sample_1',
  certificateNumber: 'SKV-2026-8842',
  studentId: 'user_student_1',
  studentName: 'Alex Morgan',
  studentEmail: 'alex.morgan@example.com',
  courseId: 'course_ai_101',
  courseTitle: 'Deep Learning & Generative AI Systems: From Math to Production',
  instructorName: 'Dr. Elena Rostova',
  issueDate: '2026-03-01',
  verificationCode: 'SKV-VERIFY-904128-ROSTOVA',
  skillsGained: [
    'PyTorch Transformers',
    'Scaled Dot-Product Attention',
    'Vector Database Indexing',
    'QLoRA Model Fine-Tuning'
  ]
};
