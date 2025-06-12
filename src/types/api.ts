
// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Chat message types
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: number;
  sources?: Source[];
}

export interface Source {
  url: string;
  title: string;
}

// LLM API types
export interface LLMChatRequest {
  session_name: string;
  user_input: string;
}

export interface LLMChatResponse {
  session_name: string;
  response: string;
  sources: Source[];
}

// Workspace types
export interface Workspace {
  ws_id: number;
  ws_name: string;
  user_id: number;
  ws_date: string;
  session_id: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWorkspaceRequest {
  ws_name: string;
  user_id: number;
  ws_date: string;
  session_id: string;
  is_active: boolean;
}

export interface UpdateWorkspaceRequest {
  ws_id: number;
  ws_name: string;
  user_id: number;
  is_active: boolean;
}

// Prompt types
export interface Prompt {
  prompt_id?: number;
  prompt_text: string;
  response_text: string;
  model_name: string;
  temperature: number;
  token_usage: number;
  ws_id: number;
  user_id: number;
  session_id: string;
  resp_time: number;
  sources: Source[];
  is_active: boolean;
  created_at?: string;
}

export interface CreatePromptRequest {
  prompt_text: string;
  response_text: string;
  model_name: string;
  temperature: number;
  token_usage: number;
  ws_id: number;
  user_id: number;
  session_id: string;
  resp_time: number;
  sources: Source[];
  is_active: boolean;
}

// Legacy types for compatibility
export interface ChatPrompt {
  prompt_id?: number;
  prompt_text: string;
  response_text: string;
  created_at?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
}

// Auth types
export interface SigninRequest {
  user_email: string;
  user_pwd: string;
}

export interface SignupRequest {
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_pwd: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  is_active: boolean;
}
