import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { ContentGenerator } from '../tools/ContentGenerator';
import { WorksheetCreator } from '../tools/WorksheetCreator';
import { VisualAidMaker } from '../tools/VisualAidMaker';
import { KnowledgeBase } from '../tools/KnowledgeBase';
import { ContentLibrary } from '../tools/ContentLibrary';
import { FileText, Image, MessageCircle, BookOpen, Folder } from 'lucide-react';

type DashboardView = 'main' | 'content-generator' | 'worksheet-creator' | 'visual-aid-maker' | 'knowledge-base' | 'content-library';

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('main');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'content-generator':
        return <ContentGenerator onBack={() => setCurrentView('main')} />;
      case 'worksheet-creator':
        return <WorksheetCreator onBack={() => setCurrentView('main')} />;
      case 'visual-aid-maker':
        return <VisualAidMaker onBack={() => setCurrentView('main')} />;
      case 'knowledge-base':
        return <KnowledgeBase onBack={() => setCurrentView('main')} />;
      case 'content-library':
        return <ContentLibrary onBack={() => setCurrentView('main')} />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Teaching Assistant
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Generate hyper-localized content, create differentiated worksheets, 
                design visual aids, and get instant answers to teaching questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Content Generator"
                description="Create hyper-localized teaching content using text or voice input in your local language."
                icon={<FileText className="h-6 w-6" />}
                color="border-blue-500"
                onClick={() => setCurrentView('content-generator')}
              />

              <DashboardCard
                title="Worksheet Creator"
                description="Upload textbook pages and generate differentiated worksheets for multiple grade levels."
                icon={<BookOpen className="h-6 w-6" />}
                color="border-green-500"
                onClick={() => setCurrentView('worksheet-creator')}
              />

              <DashboardCard
                title="Visual Aid Maker"
                description="Generate simple diagrams, charts, and visual learning materials for your lessons."
                icon={<Image className="h-6 w-6" />}
                color="border-orange-500"
                onClick={() => setCurrentView('visual-aid-maker')}
              />

              <DashboardCard
                title="Knowledge Base"
                description="Chat with AI to get instant answers and explanations for any teaching question."
                icon={<MessageCircle className="h-6 w-6" />}
                color="border-purple-500"
                onClick={() => setCurrentView('knowledge-base')}
              />

              <DashboardCard
                title="Content Library"
                description="Browse, manage, and download all your generated teaching materials."
                icon={<Folder className="h-6 w-6" />}
                color="border-indigo-500"
                onClick={() => setCurrentView('content-library')}
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Use voice input for content generation in your local language
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Upload clear, high-quality images of textbook pages for best results
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Save frequently used content to your library for quick access
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};