export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatMemory {
  conversationHistory: Message[];
  context: string;
  userPreferences: {
    name?: string;
    topics: string[];
    communicationStyle?: 'casual' | 'formal' | 'technical';
  };
}