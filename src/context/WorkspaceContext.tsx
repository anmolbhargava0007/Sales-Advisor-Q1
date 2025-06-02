import React, { createContext, useContext, ReactNode, useState } from "react";
import { ChatMessage } from "@/types/api";

// Minimal workspace context - keeping structure but removing functionality
interface WorkspaceContextType {
  selectedWorkspace: any;
  currentSessionType: string | null;
  currentSessionDocuments: string[];
  chatMessages: Record<number, ChatMessage[]>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [currentSessionType, setCurrentSessionType] = useState<string | null>(null);
  const [currentSessionDocuments, setCurrentSessionDocuments] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<number, ChatMessage[]>>({});

  return (
    <WorkspaceContext.Provider value={{
      selectedWorkspace,
      currentSessionType,
      currentSessionDocuments,
      chatMessages
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
