
import React from "react";
import logoWhite from "./../../public/icons/logo-white.png";
import SidebarNav from "./SidebarNav";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const showWorkspaceContent = location.pathname === "/workspace";

  return (
    <div className="h-screen flex flex-col bg-gray-900 border-r border-gray-700 w-72 overflow-hidden">
      <div className="flex justify-center">
        <img src={logoWhite} alt="Logo" className="w-64 h-[85px] mx-auto p-1" />
      </div>

      {/* SidebarNav always rendered, regardless of role */}
      <div className="border-b border-gray-900 pb-2">
        <SidebarNav />
      </div>

      {/* Empty workspace content area */}
      {showWorkspaceContent && (
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
          <div className="flex items-center text-sm font-medium text-gray-400 mb-2">
            <span>No workspaces available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
