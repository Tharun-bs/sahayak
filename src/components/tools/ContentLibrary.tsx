import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Download, Trash2, FolderOpen, FileText, BookOpen, Image } from 'lucide-react';
import { apiService } from '../../lib/api';
import { GeneratedContent } from '../../types';

interface ContentLibraryProps {
  onBack: () => void;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({ onBack }) => {
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<GeneratedContent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, selectedType]);

  const loadContent = async () => {
    try {
      const generatedContent = await apiService.getGeneratedContent();
      setContent(generatedContent);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.output.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  };

  const handleDownload = (item: GeneratedContent) => {
    const blob = new Blob([item.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText className="h-5 w-5" />;
      case 'worksheet':
        return <BookOpen className="h-5 w-5" />;
      case 'visual-aid':
        return <Image className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content':
        return 'bg-blue-100 text-blue-800';
      case 'worksheet':
        return 'bg-green-100 text-green-800';
      case 'visual-aid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
            <p className="text-gray-600">Loading your saved content...</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
          <p className="text-gray-600">Browse and manage your generated teaching materials</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="content">Content</option>
                <option value="worksheet">Worksheets</option>
                <option value="visual-aid">Visual Aids</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredContent.length} of {content.length} items
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {content.length === 0 ? 'No Content Yet' : 'No Matching Content'}
            </h3>
            <p className="text-gray-600">
              {content.length === 0
                ? 'Start creating content using the tools available in the dashboard.'
                : 'Try adjusting your search terms or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.type.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.output.substring(0, 120)}...
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.metadata?.language && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {item.metadata.language}
                    </span>
                  )}
                  {item.metadata?.gradeLevel && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {item.metadata.gradeLevel}
                    </span>
                  )}
                  {item.metadata?.subject && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {item.metadata.subject}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};