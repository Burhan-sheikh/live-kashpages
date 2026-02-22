'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPage } from '@/lib/firebase/pages';
import { generateSlug } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewPagePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft' as 'draft' | 'published',
  });

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user) return;

    if (!formData.title.trim()) {
      toast.error('Please enter a page title');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please enter a page URL');
      return;
    }

    setLoading(true);

    const { page, error } = await createPage({
      ...formData,
      status,
      userId: user.uid,
      sections: [],
      theme: {
        primaryColor: '#3B82F6',
        fontFamily: 'Inter',
      },
    });

    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    toast.success(
      status === 'published' ? 'Page published successfully!' : 'Page saved as draft'
    );
    router.push(`/dashboard/pages/${page!.id}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pages"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
          <p className="text-gray-600 mt-1">Set up your page details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., My Awesome Product"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page URL *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">kashpages.com/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: generateSlug(e.target.value) })
                }
                placeholder="my-awesome-product"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This is the URL where your page will be accessible
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of your page (optional)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
        <Link
          href="/dashboard/pages"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Cancel
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create & Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
