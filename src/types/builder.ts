export type ComponentType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'contact'
  | 'text'
  | 'image'
  | 'video'
  | 'spacer';

export interface ComponentData {
  id: string;
  type: ComponentType;
  data: any;
}

export interface HeroData {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface FeaturesData {
  title: string;
  subtitle?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  columns: 2 | 3 | 4;
}

export interface TestimonialsData {
  title: string;
  subtitle?: string;
  testimonials: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating: number;
  }[];
}

export interface PricingData {
  title: string;
  subtitle?: string;
  plans: {
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted: boolean;
    buttonText: string;
    buttonLink: string;
  }[];
}

export interface CTAData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
}

export interface ContactData {
  title: string;
  subtitle?: string;
  email: string;
  phone?: string;
  address?: string;
  showForm: boolean;
}

export interface TextData {
  content: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ImageData {
  url: string;
  alt: string;
  width: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
}

export interface VideoData {
  url: string;
  platform: 'youtube' | 'vimeo' | 'custom';
  width: 'small' | 'medium' | 'large' | 'full';
}

export interface SpacerData {
  height: 'small' | 'medium' | 'large';
}
