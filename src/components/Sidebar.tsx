
import React, { useEffect } from "react";
import logoWhite from "./../../public/icons/logo-white.png";
import SidebarNav from "./SidebarNav";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const showWorkspaceContent = location.pathname === "/workspace";
  
  const { 
    workspaces, 
    selectedWorkspace, 
    loadWorkspaces, 
    loadWorkspaceMessages,
    clearChat 
  } = useWorkspace();

  useEffect(() => {
    if (showWorkspaceContent) {
      loadWorkspaces();
    }
  }, [showWorkspaceContent, loadWorkspaces]);

  const handleWorkspaceClick = (workspace: any) => {
    loadWorkspaceMessages(workspace);
  };

  const handleNewChat = () => {
    clearChat();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 border-r border-gray-700 w-72 overflow-hidden">
      <div className="flex justify-center">
        <img src={logoWhite} alt="Logo" className="w-64 h-[85px] mx-auto p-1" />
      </div>

      {/* SidebarNav always rendered */}
      <div className="border-b border-gray-900 pb-2">
        <SidebarNav />
      </div>

      {/* Workspace content area */}
      {showWorkspaceContent && (
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
          {/* New Chat Button */}
          <div className="mb-4">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start bg-[#A259FF] hover:bg-[#A259FF]/90 text-white"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Workspaces Header */}
          <div className="flex items-center text-sm font-medium text-gray-400 mb-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Recent Chats</span>
          </div>

          {/* Workspaces List */}
          <div className="space-y-1">
            {workspaces.length === 0 ? (
              <div className="text-gray-500 text-sm italic px-2 py-1">
                No chat sessions yet
              </div>
            ) : (
              workspaces.map((workspace) => (
                <button
                  key={workspace.ws_id}
                  onClick={() => handleWorkspaceClick(workspace)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedWorkspace?.ws_id === workspace.ws_id
                      ? "bg-[#A259FF] text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="truncate" title={workspace.ws_name}>
                    {workspace.ws_name}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
