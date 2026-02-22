'use client';

import { Component, PageTheme } from '@/types/builder';
import HeroRenderer from './HeroRenderer';
import FeaturesRenderer from './FeaturesRenderer';
import TestimonialsRenderer from './TestimonialsRenderer';
import PricingRenderer from './PricingRenderer';
import CTARenderer from './CTARenderer';
import ContactRenderer from './ContactRenderer';
import TextRenderer from './TextRenderer';
import ImageRenderer from './ImageRenderer';
import VideoRenderer from './VideoRenderer';
import SpacerRenderer from './SpacerRenderer';

interface ComponentRendererProps {
  component: Component;
  theme: PageTheme;
  isPreview?: boolean;
}

export default function ComponentRenderer({ component, theme, isPreview = false }: ComponentRendererProps) {
  const commonProps = { data: component.data, theme, isPreview };

  switch (component.type) {
    case 'hero':
      return <HeroRenderer {...commonProps} />;
    case 'features':
      return <FeaturesRenderer {...commonProps} />;
    case 'testimonials':
      return <TestimonialsRenderer {...commonProps} />;
    case 'pricing':
      return <PricingRenderer {...commonProps} />;
    case 'cta':
      return <CTARenderer {...commonProps} />;
    case 'contact':
      return <ContactRenderer {...commonProps} />;
    case 'text':
      return <TextRenderer {...commonProps} />;
    case 'image':
      return <ImageRenderer {...commonProps} />;
    case 'video':
      return <VideoRenderer {...commonProps} />;
    case 'spacer':
      return <SpacerRenderer {...commonProps} />;
    default:
      return (
        <div className="p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Unknown component type: {component.type}</p>
        </div>
      );
  }
}
