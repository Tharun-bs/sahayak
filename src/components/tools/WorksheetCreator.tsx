import React, { useState } from 'react';
import { ArrowLeft, Upload, Loader2, Download, Save, BookOpen } from 'lucide-react';
import { apiService } from '../../lib/api';
import { GeneratedContent } from '../../types';

interface WorksheetCreatorProps {
  onBack: () => void;
}

export const WorksheetCreator: React.FC<WorksheetCreatorProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [subject, setSubject] = useState('');

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    try {
      const content = await apiService.generateContent({
        type: 'worksheet',
        input: `Textbook page analysis for worksheet generation`,
        subject,
        imageFile: selectedFile
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate worksheet:', error);
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
    a.download = `${generatedContent.title}_worksheets.txt`;
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
          <h2 className="text-2xl font-bold text-gray-900">Worksheet Creator</h2>
          <p className="text-gray-600">Generate differentiated worksheets from textbook pages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Textbook Page</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Science, History"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Uploaded textbook page"
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload textbook page
                      </p>
                      <p className="text-gray-600 mb-4">
                        Drag and drop an image file or click to browse
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isGenerating}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                <span>{isGenerating ? 'Analyzing Page...' : 'Generate Worksheets'}</span>
              </button>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">Tips for Best Results</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Upload clear, high-resolution images of textbook pages
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Ensure text is clearly visible and not cut off
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Include diagrams or illustrations for richer content analysis
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Specify the subject for more targeted worksheet generation
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {generatedContent ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Worksheets</h3>
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Differentiated
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Multiple Grades
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
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create Worksheets</h3>
                <p className="text-gray-600">
                  Upload a textbook page image to generate differentiated worksheets for multiple grade levels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};