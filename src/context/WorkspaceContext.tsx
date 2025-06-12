import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { ChatMessage, Workspace, Prompt } from "@/types/api";
import { api } from "@/services/api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  workspaces: Workspace[];
  currentSessionId: string;
  currentSessionName: string;
  chatMessages: ChatMessage[];
  workspaceLoadingStates: { [key: number]: boolean };
  isWorkspaceLoading: boolean;
  isNewChatLoading: boolean;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  loadWorkspaces: () => Promise<Workspace[] | undefined>;
  loadWorkspaceMessages: (workspace: Workspace) => Promise<void>;
  loadWorkspaceById: (wsId: number) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [currentSessionName, setCurrentSessionName] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [workspaceLoadingStates, setWorkspaceLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [isNewChatLoading, setIsNewChatLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadWorkspaces = useCallback(async (): Promise<Workspace[] | undefined> => {
    if (!user?.user_id) return;

    try {
      const response = await api.workspaces.getByUser(user.user_id);
      setWorkspaces(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to load workspaces:", error);
      return [];
    }
  }, [user?.user_id]);

  const loadWorkspaceMessages = useCallback(async (workspace: Workspace) => {
    if (!user?.user_id) return;

    try {
      setIsWorkspaceLoading(true);

      // Clear current messages first
      setChatMessages([]);

      const response = await api.prompts.getByWorkspace(user.user_id, workspace.ws_id);

      const messages: ChatMessage[] = [];

      response.data.forEach((prompt) => {
        const baseTime = new Date(prompt.created_at || Date.now()).getTime();
        const promptId = prompt.prompt_id || uuidv4();

        messages.push(
          {
            id: `user-${promptId}`,
            content: prompt.prompt_text,
            type: "user",
            timestamp: baseTime,
          },
          {
            id: `bot-${promptId}`,
            content: prompt.response_text,
            type: "bot",
            timestamp: baseTime + 1,
            sources: prompt.sources,
          }
        );
      });

      setChatMessages(messages);
      setCurrentSessionId(workspace.session_id);
      setCurrentSessionName(workspace.ws_name);
      setSelectedWorkspace(workspace);

      // Update URL to reflect selected workspace
      navigate(`/workspace/${workspace.ws_id}`, { replace: true });
    } catch (error) {
      console.error("Failed to load workspace messages:", error);
    } finally {
      setIsWorkspaceLoading(false);
    }
  }, [user?.user_id, navigate]);

  const loadWorkspaceById = useCallback(async (wsId: number) => {
    if (!user?.user_id) return;

    try {
      setIsWorkspaceLoading(true);
      const workspacesData = await loadWorkspaces();
      const workspace = workspacesData?.find(w => w.ws_id === wsId);

      if (workspace) {
        await loadWorkspaceMessages(workspace);
      }
    } catch (error) {
      console.error("Failed to load workspace by ID:", error);
    } finally {
      setIsWorkspaceLoading(false);
    }
  }, [user?.user_id, loadWorkspaces, loadWorkspaceMessages]);

  const sendMessage = useCallback(async (message: string) => {
    if (!user?.user_id || !message.trim()) return;
  
    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: message,
        type: 'user',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, userMessage]);
  
      // Generate session ID if new conversation
      const sessionId = currentSessionId || uuidv4();
      const sessionName = currentSessionName || "";
  
      // Set loading state for current workspace (if exists) or new chat
      if (selectedWorkspace) {
        setWorkspaceLoadingStates(prev => ({ ...prev, [selectedWorkspace.ws_id]: true }));
      } else {
        setIsNewChatLoading(true);
      }
  
      // Create or get workspace first for new conversations
      let workspaceId = selectedWorkspace?.ws_id;
      let createdPromptId: number | null = null;
  
      if (!selectedWorkspace) {
        // Hit LLM first for new chat
        const startTime = Date.now();
        const llmResponse = await api.llm.chat({
          session_name: "", // Empty or default name
          user_input: message,
        });
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000;
  
        // Create workspace using returned session_name
        const workspaceResponse = await api.workspaces.create({
          ws_name: llmResponse.session_name,
          user_id: user.user_id,
          session_id: sessionId,
          is_active: true,
        });
  
        const newWorkspace = workspaceResponse.data[0];
        workspaceId = newWorkspace.ws_id;
  
        setSelectedWorkspace(newWorkspace);
        setWorkspaces(prev => [newWorkspace, ...prev]);
        setCurrentSessionId(sessionId);
        setCurrentSessionName(llmResponse.session_name);
        navigate(`/workspace/${newWorkspace.ws_id}`, { replace: true });
  
        // Add bot message to UI
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: llmResponse.response,
          type: 'bot',
          timestamp: Date.now(),
          sources: llmResponse.sources,
        };
        setChatMessages(prev => [...prev, botMessage]);
  
        // Create prompt with LLM response
        const promptResponse = await api.prompts.create({
          prompt_text: message,
          response_text: llmResponse.response,
          model_name: "llama3.2:latest",
          temperature: 1.5,
          token_usage: 200,
          ws_id: workspaceId,
          user_id: user.user_id,
          session_id: sessionId,
          resp_time: responseTime,
          sources: llmResponse.sources,
          is_active: true,
        });
  
        if (promptResponse.data && promptResponse.data.length > 0) {
          createdPromptId = promptResponse.data[0].prompt_id || null;
        }
      } else {
        // Existing chat flow
        // Create prompt first
        const promptResponse = await api.prompts.create({
          prompt_text: message,
          response_text: "",
          model_name: "llama3.2:latest",
          temperature: 1.5,
          token_usage: 200,
          ws_id: workspaceId!,
          user_id: user.user_id,
          session_id: currentSessionId,
          resp_time: 0,
          sources: [],
          is_active: true,
        });
  
        if (promptResponse.data?.length > 0) {
          createdPromptId = promptResponse.data[0].prompt_id || null;
        }
  
        // Hit LLM
        const startTime = Date.now();
        const llmResponse = await api.llm.chat({
          session_name: currentSessionName,
          user_input: message,
        });
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000;
  
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: llmResponse.response,
          type: 'bot',
          timestamp: Date.now(),
          sources: llmResponse.sources,
        };
        setChatMessages(prev => [...prev, botMessage]);
  
        if (createdPromptId) {
          await api.prompts.update({
            prompt_id: createdPromptId,
            prompt_text: message,
            response_text: llmResponse.response,
            model_name: "llama3.2:latest",
            temperature: 1.5,
            token_usage: 200,
            ws_id: workspaceId!,
            user_id: user.user_id,
            session_id: currentSessionId,
            resp_time: responseTime,
            sources: llmResponse.sources,
            is_active: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message to UI
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, there was an error processing your message. Please try again.",
        type: 'bot',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      // Reset loading state
      if (selectedWorkspace) {
        setWorkspaceLoadingStates(prev => ({ ...prev, [selectedWorkspace.ws_id]: false }));
      } else {
        setIsNewChatLoading(false);
      }
    }
  }, [user?.user_id, currentSessionId, currentSessionName, selectedWorkspace, navigate]);
  
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setSelectedWorkspace(null);
    setCurrentSessionId("");
    setCurrentSessionName("");
    // Navigate to default workspace view
    navigate("/workspace", { replace: true });
  }, [navigate]);

  return (
    <WorkspaceContext.Provider value={{
      selectedWorkspace,
      workspaces,
      currentSessionId,
      currentSessionName,
      chatMessages,
      workspaceLoadingStates,
      isWorkspaceLoading,
      isNewChatLoading,
      setSelectedWorkspace,
      loadWorkspaces,
      loadWorkspaceMessages,
      loadWorkspaceById,
      sendMessage,
      clearChat,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};