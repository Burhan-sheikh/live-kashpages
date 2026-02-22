import { Timestamp } from 'firebase/firestore';

// User Types
export type PlanType = 'free' | 'pro';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: PlanType;
  planExpiresAt?: Timestamp | null;
  shopCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Shop Types
export type ShopStatus = 'draft' | 'published' | 'unpublished';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  mapLink?: string;
  embedCode?: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  address: Address;
}

export interface SEOSettings {
  title: string;
  description: string;
  tags: string[];
  image: string;
  favicon?: string;
}

export interface ShopSettings {
  ratingsEnabled: boolean; // Pro only
  removeBranding: boolean; // Pro only
  passwordProtected: boolean;
  password?: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  coverImage: string;
  gallery: string[]; // Max 3 for free, 30 for pro
  about: string;
  h2Title: string;
  services: Service[];
  faq: FAQ[];
  contact: ContactInfo;
  seo: SEOSettings;
  settings: ShopSettings;
  status: ShopStatus;
  averageRating?: number;
  reviewCount?: number;
  ratingDistribution?: { [key: number]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

// Review Types
export interface Review {
  id: string;
  shopId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  isVisible: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Analytics Types
export interface Analytics {
  id: string;
  shopId: string;
  date: string; // YYYY-MM-DD
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  locationClicks: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AnalyticsSummary {
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  locationClicks: number;
}

// Payment Types
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  plan: PlanType;
  validUntil: Timestamp;
  paymentMethod: string;
  customerEmail: string;
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  plan: PlanType;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

// Plan Types
export interface PlanFeatures {
  maxShops: number;
  maxGalleryImages: number;
  analytics: boolean;
  advancedAnalytics: boolean;
  reviews: boolean;
  removeBranding: boolean;
  customFavicon: boolean;
  seoTags: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeatures;
  popular?: boolean;
}

// Form Types for Shop Creation
export interface ShopFormStep1 {
  coverImage: string;
  title: string;
  ratingsEnabled: boolean;
  gallery: string[];
  about: string;
  h2Title: string;
  services: Service[];
  faq: FAQ[];
}

export interface ShopFormStep2 {
  phone: string;
  whatsappSameAsPhone: boolean;
  whatsapp: string;
  address: Address;
}

export interface ShopFormStep3 {
  seoTitle: string;
  slug: string;
  seoImage: string;
  favicon?: string;
  seoTags: string[];
  seoDescription: string;
  removeBranding: boolean;
  passwordProtected: boolean;
  password?: string;
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface ShopCardProps {
  shop: Shop;
  onEdit?: () => void;
  onDelete?: () => void;
  onUnpublish?: () => void;
}

export interface ReviewCardProps {
  review: Review;
  onToggleVisibility: (reviewId: string, isVisible: boolean) => void;
  onDelete: (reviewId: string) => void;
}

export interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}
