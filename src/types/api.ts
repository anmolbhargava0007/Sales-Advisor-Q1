
// Simplified types - removing workspace and document functionality
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: number;
}

export interface SigninRequest {
  user_email: string;
  user_pwd: string;
}

export interface SignupRequest {
  user_name: string;
  user_email: string;
  user_pwd: string;
  user_mobile: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  is_active: boolean;
}
