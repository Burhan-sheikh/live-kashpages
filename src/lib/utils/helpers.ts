/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if slug is available (unique)
 */
export async function isSlugAvailable(slug: string, excludeShopId?: string): Promise<boolean> {
  // This should query Firestore to check uniqueness
  // For now, return true (implement in component)
  return true;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | { toDate: () => Date }): string {
  const dateObj = date instanceof Date ? date : date.toDate();
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | { toDate: () => Date }): string {
  const dateObj = date instanceof Date ? date : date.toDate();
  
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate PIN code (Indian format)
 */
export function isValidPinCode(pinCode: string): boolean {
  const pinRegex = /^[1-9]\d{5}$/;
  return pinRegex.test(pinCode);
}

/**
 * Format phone number for WhatsApp link
 */
export function formatWhatsAppLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/91${cleanPhone}`;
}

/**
 * Format phone number for tel: link
 */
export function formatTelLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `tel:+91${cleanPhone}`;
}

/**
 * Calculate days until expiry
 */
export function daysUntilExpiry(expiryDate: Date | { toDate: () => Date }): number {
  const dateObj = expiryDate instanceof Date ? expiryDate : expiryDate.toDate();
  const now = new Date();
  const diff = dateObj.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Generate SEO meta tags
 */
export function generateMetaTags(options: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}) {
  return {
    title: options.title,
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      images: options.image ? [{ url: options.image }] : [],
      url: options.url,
      type: options.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: options.image ? [options.image] : [],
    },
  };
}

/**
 * File size validator (in bytes)
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Image file type validator
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
