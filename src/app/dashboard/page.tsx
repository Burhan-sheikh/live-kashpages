'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import {
  Plus,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - will be replaced with real Firestore data
  const stats = [
    {
      label: 'Total Pages',
      value: '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Views',
      value: '0',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Active Pages',
      value: '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Draft Pages',
      value: '0',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentPages = [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-primary-100 mb-6">
          Ready to create something amazing? Start building your page now.
        </p>
        <Link
          href="/dashboard/pages/new"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Pages */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Pages</h2>
            <Link
              href="/dashboard/pages"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {recentPages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No pages yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first page to get started
            </p>
            <Link
              href="/dashboard/pages/new"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recentPages.map((page: any) => (
              <div
                key={page.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                {/* Page item content will go here */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start from Template
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our collection of professional templates
              </p>
              <Link
                href="/dashboard/templates"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Track your page performance and visitor insights
              </p>
              <Link
                href="/dashboard/analytics"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                View Analytics
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
