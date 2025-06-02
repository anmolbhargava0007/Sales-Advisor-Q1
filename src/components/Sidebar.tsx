
import React, { useEffect, useState } from "react";
import logoWhite from "./../../public/icons/logo-white.png";
import SidebarNav from "./SidebarNav";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/DeleteModal";
import WorkspaceDialog from "@/components/WorkspaceDialog";
import FreeTierModal from "@/components/FreeTierModal";
import { toast } from "sonner";
import { api } from "@/services/api";

const Sidebar = () => {
  const location = useLocation();
  const showWorkspaceContent = location.pathname === "/workspace";
  const { user, isAppValid } = useAuth();
  
  const { 
    workspaces, 
    selectedWorkspace, 
    loadWorkspaces, 
    loadWorkspaceMessages,
    clearChat,
    setSelectedWorkspace
  } = useWorkspace();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFreeTierModal, setShowFreeTierModal] = useState(false);
  const [selectedWorkspaceForAction, setSelectedWorkspaceForAction] = useState<any>(null);

  useEffect(() => {
    if (showWorkspaceContent) {
      const load = async () => {
        await loadWorkspaces();
      };
      load();
    }
  }, [showWorkspaceContent, loadWorkspaces]);

  const handleWorkspaceClick = (workspace: any) => {
    setSelectedWorkspace(workspace);
    loadWorkspaceMessages(workspace);
  };

  const checkFreeTier = () => {
    if (!isAppValid) {
      setShowFreeTierModal(true);
      return false;
    }
    return true;
  };

  const handleNewChat = () => {
    if (!checkFreeTier()) return;
    clearChat();
  };

  const handleEditWorkspace = (workspace: any) => {
    setSelectedWorkspaceForAction(workspace);
    setEditDialogOpen(true);
  };

  const handleDeleteWorkspace = (workspace: any) => {
    setSelectedWorkspaceForAction(workspace);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedWorkspaceForAction || !user?.user_id) return;
    
    try {
      await api.workspaces.delete(selectedWorkspaceForAction.ws_id);
      toast.success("Workspace deleted successfully");
      await loadWorkspaces();
      
      // If deleted workspace was selected, clear chat
      if (selectedWorkspace?.ws_id === selectedWorkspaceForAction.ws_id) {
        clearChat();
      }
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      toast.error("Failed to delete workspace");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedWorkspaceForAction(null);
    }
  };

  const handleSaveEdit = async (newName: string) => {
    if (!selectedWorkspaceForAction || !user?.user_id || !newName.trim()) return;
    
    try {
      const updatedWorkspace = {
        ...selectedWorkspaceForAction,
        ws_name: newName.trim(),
        user_id: user.user_id
      };
      
      await api.workspaces.update(updatedWorkspace);
      toast.success("Workspace updated successfully");
      await loadWorkspaces();
      
      // Update selected workspace if it was the one being edited
      if (selectedWorkspace?.ws_id === selectedWorkspaceForAction.ws_id) {
        setSelectedWorkspace(updatedWorkspace);
      }
    } catch (error) {
      console.error("Failed to update workspace:", error);
      toast.error("Failed to update workspace");
    } finally {
      setEditDialogOpen(false);
      setSelectedWorkspaceForAction(null);
    }
  };

  return (
    <>
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
                  onClick={() => handleWorkspaceClick(workspace)}

                    key={workspace.ws_id}
                    className={`group flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedWorkspace?.ws_id === workspace.ws_id
                        ? "bg-[#A259FF] text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div
                      className="flex-1 text-left truncate"
                      title={workspace.ws_name}
                    >
                      {workspace.ws_name}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => handleEditWorkspace(workspace)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteWorkspace(workspace)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Workspace"
        description="Are you sure you want to delete this workspace? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <WorkspaceDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        workspace={selectedWorkspaceForAction}
        onSave={handleSaveEdit}
      />

      <FreeTierModal
        isOpen={showFreeTierModal}
        onClose={() => setShowFreeTierModal(false)}
      />
    </>
  );
};

export default Sidebar;
