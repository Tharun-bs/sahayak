import { ContentGenerationRequest, GeneratedContent, ChatMessage } from '../types';

// Mock API service for development - replace with actual Firebase Functions
class APIService {
  private generatedContent: GeneratedContent[] = [];
  private chatHistory: ChatMessage[] = [];

  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let output = '';
    const metadata: any = {
      language: request.language || 'English',
      gradeLevel: request.gradeLevel,
      subject: request.subject
    };

    switch (request.type) {
      case 'content':
        output = `Generated educational content for "${request.input}"\n\n` +
                `**Learning Objectives:**\n` +
                `• Understand the core concepts of ${request.input}\n` +
                `• Apply knowledge through practical examples\n` +
                `• Develop critical thinking skills\n\n` +
                `**Content Overview:**\n` +
                `This lesson covers the fundamental aspects of ${request.input}, designed for ${request.gradeLevel || 'elementary'} level students. ` +
                `The content includes interactive activities, real-world examples, and assessment questions to ensure comprehensive understanding.\n\n` +
                `**Activities:**\n` +
                `1. Introduction discussion\n` +
                `2. Hands-on demonstration\n` +
                `3. Group activities\n` +
                `4. Individual practice\n` +
                `5. Assessment and reflection`;
        break;

      case 'worksheet':
        output = `**Differentiated Worksheets Generated**\n\n` +
                `**Grade 3 Level:**\n` +
                `• Basic identification exercises\n` +
                `• Simple matching activities\n` +
                `• Visual learning aids\n` +
                `• Short answer questions (1-2 words)\n\n` +
                `**Grade 5 Level:**\n` +
                `• Analysis and comparison tasks\n` +
                `• Problem-solving scenarios\n` +
                `• Extended writing exercises\n` +
                `• Critical thinking questions\n\n` +
                `**Assessment Rubric:**\n` +
                `• Understanding: Basic to Advanced\n` +
                `• Application: Guided to Independent\n` +
                `• Communication: Simple to Complex`;
        break;

      case 'visual-aid':
        output = `**Visual Aid Generated**\n\n` +
                `Title: ${request.input}\n\n` +
                `[Generated diagram/chart would appear here]\n\n` +
                `**Description:**\n` +
                `A clear, educational diagram illustrating ${request.input}. ` +
                `The visual aid includes labeled components, color coding for better understanding, ` +
                `and is optimized for classroom display.\n\n` +
                `**Usage Tips:**\n` +
                `• Display prominently during lesson introduction\n` +
                `• Use as reference during activities\n` +
                `• Students can create their own versions\n` +
                `• Perfect for visual learners`;
        metadata.imageUrl = `https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800`;
        break;
    }

    const content: GeneratedContent = {
      id: `content_${Date.now()}`,
      userId: 'current_user',
      type: request.type,
      title: `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} - ${request.input}`,
      input: request.input,
      output,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.generatedContent.push(content);
    return content;
  }

  async sendChatMessage(message: string): Promise<ChatMessage> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = [
      `Great question! Let me help you with that. ${message.includes('?') ? 'Here\'s what I recommend...' : 'I understand you\'re looking for information about'} "${message}". Would you like me to generate specific content for your lesson?`,
      `I can definitely assist with that! For topics like "${message}", I suggest creating hands-on activities that engage students. Would you like me to create a worksheet or visual aid?`,
      `That's an interesting educational challenge! Based on my experience with similar topics, here are some effective approaches you might consider...`,
      `Perfect! I love helping teachers with creative lesson planning. For "${message}", you might want to consider different learning styles and grade-appropriate activities.`
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const chatMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      userId: 'current_user',
      message,
      response,
      timestamp: new Date()
    };

    this.chatHistory.push(chatMessage);
    return chatMessage;
  }

  async getGeneratedContent(): Promise<GeneratedContent[]> {
    return [...this.generatedContent];
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return [...this.chatHistory];
  }
}

export const apiService = new APIService();