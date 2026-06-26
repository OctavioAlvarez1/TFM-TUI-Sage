export interface SourceDocument {
  destination_name: string;
  text: string;
  relevance: number;
}

export type FeedbackType = 'up' | 'down';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: SourceDocument[];
  isStreaming: boolean;
  timestamp: Date;
  feedback?: FeedbackType | null;
}

export interface StatusResponse {
  kb_built: boolean;
  api_key_set: boolean;
  collection_name: string;
  document_count: number;
  status: 'ready' | 'kb_missing' | 'api_key_missing' | 'error';
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export type SseEvent =
  | { type: 'source'; destination_name: string; text: string; relevance: number }
  | { type: 'token'; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string };
