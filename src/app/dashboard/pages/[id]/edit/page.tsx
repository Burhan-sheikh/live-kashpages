'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPage, updatePage } from '@/lib/firebase/pages';
import { Page } from '@/types';
import { ComponentData } from '@/types/builder';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Smartphone,
  Monitor,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import ComponentLibrary from '@/components/builder/ComponentLibrary';
import PageCanvas from '@/components/builder/PageCanvas';
import ComponentEditor from '@/components/builder/ComponentEditor';
import PageSettings from '@/components/builder/PageSettings';

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'settings'>('components');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  useEffect(() => {
    if (user && pageId) {
      loadPage();
    }
  }, [user, pageId]);

  const loadPage = async () => {
    setLoading(true);
    const fetchedPage = await getPage(pageId);

    if (!fetchedPage) {
      toast.error('Page not found');
      router.push('/dashboard/pages');
      return;
    }

    if (fetchedPage.userId !== user?.uid) {
      toast.error('You do not have permission to edit this page');
      router.push('/dashboard/pages');
      return;
    }

    setPage(fetchedPage);
    setLoading(false);
  };

  const handleAddComponent = (component: ComponentData) => {
    if (!page) return;

    const updatedSections = [...page.sections, component];
    setPage({ ...page, sections: updatedSections });
    setSelectedComponentId(component.id);
  };

  const handleUpdateComponent = (componentId: string, data: any) => {
    if (!page) return;

    const updatedSections = page.sections.map((section) =>
      section.id === componentId ? { ...section, data } : section
    );
    setPage({ ...page, sections: updatedSections });
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!page) return;

    const updatedSections = page.sections.filter((section) => section.id !== componentId);
    setPage({ ...page, sections: updatedSections });
    setSelectedComponentId(null);
  };

  const handleMoveComponent = (componentId: string, direction: 'up' | 'down') => {
    if (!page) return;

    const index = page.sections.findIndex((s) => s.id === componentId);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === page.sections.length - 1) return;

    const updatedSections = [...page.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedSections[index], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[index],
    ];

    setPage({ ...page, sections: updatedSections });
  };

  const handleUpdatePageSettings = (settings: Partial<Page>) => {
    if (!page) return;
    setPage({ ...page, ...settings });
  };

  const handleSave = async (publish: boolean = false) => {
    if (!page) return;

    setSaving(true);

    const updateData: Partial<Page> = {
      ...page,
      status: publish ? 'published' : page.status,
      updatedAt: Date.now(),
    };

    if (publish && !page.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    const { error } = await updatePage(pageId, updateData);

    if (error) {
      toast.error(error);
      setSaving(false);
      return;
    }

    toast.success(publish ? 'Page published successfully!' : 'Page saved');
    setSaving(false);

    if (publish) {
      loadPage();
    }
  };

  const selectedComponent = page?.sections.find((s) => s.id === selectedComponentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{page.title}</h1>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library or Settings */}
        <aside className="w-80 bg-white border-r flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('components')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'components'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Components
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'components' ? (
              <ComponentLibrary onAddComponent={handleAddComponent} />
            ) : (
              <PageSettings page={page} onUpdate={handleUpdatePageSettings} />
            )}
          </div>
        </aside>

        {/* Center - Page Canvas */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <PageCanvas
            page={page}
            previewMode={previewMode}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            onDeleteComponent={handleDeleteComponent}
            onMoveComponent={handleMoveComponent}
          />
        </main>

        {/* Right Sidebar - Component Editor */}
        {selectedComponent && (
          <aside className="w-80 bg-white border-l overflow-y-auto">
            <ComponentEditor
              component={selectedComponent}
              onUpdate={(data) => handleUpdateComponent(selectedComponent.id, data)}
              onClose={() => setSelectedComponentId(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
