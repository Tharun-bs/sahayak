export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
}

export interface GeneratedContent {
  id: string;
  userId: string;
  type: 'content' | 'worksheet' | 'visual-aid';
  title: string;
  input: string;
  output: string;
  metadata?: {
    language?: string;
    gradeLevel?: string;
    subject?: string;
    imageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface ContentGenerationRequest {
  type: 'content' | 'worksheet' | 'visual-aid';
  input: string;
  language?: string;
  gradeLevel?: string;
  subject?: string;
  imageFile?: File;
}