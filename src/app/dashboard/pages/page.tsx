'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserPages, deletePage } from '@/lib/firebase/pages';
import { Page } from '@/types';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function PagesListPage() {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (user) {
      loadPages();
    }
  }, [user]);

  const loadPages = async () => {
    if (!user) return;

    setLoading(true);
    const userPages = await getUserPages(user.uid);
    setPages(userPages);
    setLoading(false);
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    const { error } = await deletePage(pageId);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Page deleted successfully');
    setPages(pages.filter((p) => p.id !== pageId));
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'published' && page.status === 'published') ||
      (filterStatus === 'draft' && page.status === 'draft');

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pages</h1>
          <p className="text-gray-600 mt-1">Manage all your landing pages</p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      {filteredPages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600 mb-6">Create your first page to get started</p>
          <Link
            href="/dashboard/pages/new"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <FileText className="w-12 h-12 text-primary-600" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                    {page.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {page.status === 'published' ? (
                      <><CheckCircle className="w-3 h-3" />Published</>
                    ) : (
                      <><Clock className="w-3 h-3" />Draft</>
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {page.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {page.views || 0}
                  </span>
                  <span>
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/pages/${page.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  {page.status === 'published' && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeletePage(page.id!)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
