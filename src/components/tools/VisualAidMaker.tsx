import React, { useState } from 'react';
import { ArrowLeft, Image, Loader2, Download, Save } from 'lucide-react';
import { apiService } from '../../lib/api';
import { GeneratedContent } from '../../types';

interface VisualAidMakerProps {
  onBack: () => void;
}

export const VisualAidMaker: React.FC<VisualAidMakerProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [aidType, setAidType] = useState('diagram');
  const [complexity, setComplexity] = useState('simple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      const content = await apiService.generateContent({
        type: 'visual-aid',
        input: `${aidType} - ${input}`,
        metadata: { complexity, aidType }
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate visual aid:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent.title}_visual_aid.txt`;
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
          <h2 className="text-2xl font-bold text-gray-900">Visual Aid Maker</h2>
          <p className="text-gray-600">Generate simple diagrams and visual learning materials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Aid Request</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aid Type
                  </label>
                  <select
                    value={aidType}
                    onChange={(e) => setAidType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="diagram">Diagram</option>
                    <option value="chart">Chart</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="timeline">Timeline</option>
                    <option value="mind-map">Mind Map</option>
                    <option value="illustration">Simple Illustration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to visualize (e.g., 'Solar system with planets and their orbits', 'Water cycle process', 'Parts of a plant')"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-32"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!input.trim() || isGenerating}
                className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Image className="h-5 w-5" />
                )}
                <span>{isGenerating ? 'Generating...' : 'Generate Visual Aid'}</span>
              </button>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3">Visual Aid Types</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-orange-800">
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Diagrams (labeled parts)
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Process flowcharts
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Comparison charts
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Timeline visuals
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Mind maps
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 mr-2">•</span>
                Simple illustrations
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {generatedContent ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Visual Aid</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
              
              {generatedContent.metadata?.imageUrl && (
                <div className="mb-4">
                  <img
                    src={generatedContent.metadata.imageUrl}
                    alt="Generated visual aid"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {generatedContent.output}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                    {aidType}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {complexity}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Visual Aid
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create</h3>
                <p className="text-gray-600">
                  Describe what you want to visualize and we'll generate a clear, educational diagram or chart.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};