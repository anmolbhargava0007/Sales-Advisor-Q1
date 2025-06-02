
import { 
  API_BASE_URL, 
  LLM_API_BASE_URL, 
  LLM_CHAT_ENDPOINT, 
  WORKSPACES_ENDPOINT, 
  PROMPTS_ENDPOINT 
} from "@/constants/api";
import { 
  ApiResponse, 
  LLMChatRequest, 
  LLMChatResponse, 
  Workspace, 
  CreateWorkspaceRequest, 
  Prompt, 
  CreatePromptRequest 
} from "@/types/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// LLM API calls
export const llmApi = {
  chat: async (request: LLMChatRequest): Promise<LLMChatResponse> => {
    const response = await fetch(`${LLM_API_BASE_URL}${LLM_CHAT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<LLMChatResponse>(response);
  },
};

// Workspace API calls
export const workspaceApi = {
  create: async (request: CreateWorkspaceRequest): Promise<ApiResponse<Workspace[]>> => {
    const response = await fetch(`${API_BASE_URL}${WORKSPACES_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiResponse<Workspace[]>>(response);
  },

  getByUser: async (userId: number): Promise<ApiResponse<Workspace[]>> => {
    const response = await fetch(`${API_BASE_URL}${WORKSPACES_ENDPOINT}?user_id=${userId}&is_active=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<ApiResponse<Workspace[]>>(response);
  },

  update: async (workspace: Workspace): Promise<ApiResponse<Workspace>> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workspaces`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...workspace,
        user_id: workspace.user_id 
      }),
    });
    return handleResponse<ApiResponse<Workspace>>(response);
  },

  delete: async (wsId: number): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/workspaces`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ws_id: wsId,
        is_active: false,
      }),
    });
    return handleResponse<ApiResponse<null>>(response);
  },
};

// Prompt API calls
export const promptApi = {
  create: async (request: CreatePromptRequest): Promise<ApiResponse<Prompt[]>> => {
    const response = await fetch(`${API_BASE_URL}${PROMPTS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiResponse<Prompt[]>>(response);
  },

  getByWorkspace: async (userId: number, wsId: number): Promise<ApiResponse<Prompt[]>> => {
    const response = await fetch(`${API_BASE_URL}${PROMPTS_ENDPOINT}?user_id=${userId}&ws_id=${wsId}&is_active=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<ApiResponse<Prompt[]>>(response);
  },
};

export const api = {
  llm: llmApi,
  workspaces: workspaceApi,
  prompts: promptApi,
};
