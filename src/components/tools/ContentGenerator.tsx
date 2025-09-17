import React, { useState } from 'react';
import { ArrowLeft, Mic, MicOff, Send, Loader2, Download, Save } from 'lucide-react';
import { apiService } from '../../lib/api';
import { GeneratedContent } from '../../types';

interface ContentGeneratorProps {
  onBack: () => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [gradeLevel, setGradeLevel] = useState('Elementary');
  const [subject, setSubject] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      const content = await apiService.generateContent({
        type: 'content',
        input,
        language,
        gradeLevel,
        subject
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In production, implement actual speech-to-text functionality
    if (!isRecording) {
      setTimeout(() => {
        setInput(prev => prev + ' [Voice input captured]');
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Content Generator</h2>
          <p className="text-gray-600">Create hyper-localized teaching content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Request</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Elementary">Elementary (1-5)</option>
                    <option value="Middle">Middle (6-8)</option>
                    <option value="High School">High School (9-12)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Science, History"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic/Request
                </label>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the content you want to create (e.g., 'Explain photosynthesis with local examples')"
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                  />
                  <button
                    onClick={toggleRecording}
                    className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                      isRecording 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>
                {isRecording && (
                  <p className="text-sm text-red-600 mt-2 animate-pulse">
                    Recording... Speak in your local language
                  </p>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!input.trim() || isGenerating}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {generatedContent ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {generatedContent.output}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {generatedContent.metadata?.language}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {generatedContent.metadata?.gradeLevel}
                  </span>
                  {generatedContent.metadata?.subject && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {generatedContent.metadata.subject}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                <p className="text-gray-600">
                  Enter your content request and click generate to create localized teaching materials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};