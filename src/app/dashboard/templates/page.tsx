'use client';

import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Templates Coming Soon
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          We're working on a collection of beautiful, professional templates to help you get started faster. Stay tuned!
        </p>
        <Link
          href="/dashboard/pages/new"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Create from Scratch
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
