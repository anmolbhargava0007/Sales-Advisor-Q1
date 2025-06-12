import React, { useEffect, useState } from "react";
import logoWhite from "./../../public/icons/logo-white.png";
import SidebarNav from "./SidebarNav";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, MoreVertical, Edit, Trash2, X } from "lucide-react";
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

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ onClose, isMobile = false }: SidebarProps) => {
  const location = useLocation();
  const showWorkspaceContent = location.pathname.startsWith("/workspace");
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
    loadWorkspaceMessages(workspace);
    if (isMobile && onClose) {
      onClose();
    }
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
    if (isMobile && onClose) {
      onClose();
    }
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
      <div className="h-full flex flex-col bg-gray-900 border-r border-gray-700 overflow-hidden">
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <div className="flex justify-center flex-1">
            <img src={logoWhite} alt="Logo" className="w-48 md:w-64 h-auto max-h-16" />
          </div>
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* SidebarNav */}
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
                className="w-full justify-start bg-[#A259FF] hover:bg-[#A259FF]/90 text-white h-10 text-sm"
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
                    className={`group flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px] ${
                      selectedWorkspace?.ws_id === workspace.ws_id
                        ? "bg-[#A259FF] text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div
                      className="flex-1 text-left truncate pr-2"
                      title={workspace.ws_name}
                    >
                      {workspace.ws_name}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 bg-gray-800 border-gray-700">
                        <DropdownMenuItem onClick={() => handleEditWorkspace(workspace)} className="text-gray-300 focus:bg-gray-700">
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteWorkspace(workspace)}
                          className="text-red-400 focus:text-red-400 focus:bg-gray-700"
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
