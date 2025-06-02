
import React from "react";
import { FileText } from "lucide-react";
import ChatView from "./ChatView";

const WorkspaceView = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        <ChatView />
      </div>
    </div>
  );
};

export default WorkspaceView;
