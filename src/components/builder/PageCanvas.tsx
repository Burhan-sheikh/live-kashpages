'use client';

import { Page } from '@/types';
import ComponentRenderer from './renderers/ComponentRenderer';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PageCanvasProps {
  page: Page;
  previewMode: 'desktop' | 'mobile';
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (id: string, direction: 'up' | 'down') => void;
}

export default function PageCanvas({
  page,
  previewMode,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  onMoveComponent,
}: PageCanvasProps) {
  const canvasWidth = previewMode === 'desktop' ? 'max-w-6xl' : 'max-w-md';

  return (
    <div className="flex justify-center">
      <div className={`${canvasWidth} w-full bg-white rounded-lg shadow-lg overflow-hidden`}>
        {page.sections.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No components yet</h3>
            <p className="text-gray-600">Add components from the library to start building</p>
          </div>
        ) : (
          page.sections.map((component, index) => (
            <div
              key={component.id}
              className={`relative group ${
                selectedComponentId === component.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => onSelectComponent(component.id)}
            >
              <ComponentRenderer component={component} theme={page.theme} />
              
              {/* Component Controls */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveComponent(component.id, 'up');
                  }}
                  disabled={index === 0}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveComponent(component.id, 'down');
                  }}
                  disabled={index === page.sections.length - 1}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteComponent(component.id);
                  }}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
