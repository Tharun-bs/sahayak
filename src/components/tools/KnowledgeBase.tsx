import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, MessageCircle, Bot, User } from 'lucide-react';
import { apiService } from '../../lib/api';
import { ChatMessage } from '../../types';

interface KnowledgeBaseProps {
  onBack: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Load chat history on component mount
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await apiService.getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(userMessage);
      setChatHistory(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How do I explain fractions to 3rd graders?",
    "What are good classroom management techniques?",
    "How to make science lessons more engaging?",
    "Help with differentiated instruction strategies",
    "Ideas for visual learners in math class"
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-gray-600">Chat with AI for instant teaching support and answers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageCircle className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Teaching Assistant</h3>
            <p className="text-sm text-gray-600">Ready to help with your teaching questions</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
              <p className="text-gray-600 mb-6">
                Ask me anything about teaching, lesson planning, or classroom management.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 max-w-3xl">
                    <p className="text-gray-800">{chat.message}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 max-w-3xl">
                    <p className="text-gray-800 whitespace-pre-wrap">{chat.response}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your teaching question here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};