
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspaceView from "@/components/WorkspaceView";
import { useWorkspace } from "@/context/WorkspaceContext";

const WorkspaceContent = () => {
  const { wsId } = useParams<{ wsId: string }>();
  const { loadWorkspaceById, clearChat } = useWorkspace();

  useEffect(() => {
    if (wsId) {
      // Load specific workspace
      loadWorkspaceById(parseInt(wsId));
    } else {
      // Clear chat for default view
      clearChat();
    }
  }, [wsId, loadWorkspaceById, clearChat]);

  return <WorkspaceView />;
};

export default WorkspaceContent;
