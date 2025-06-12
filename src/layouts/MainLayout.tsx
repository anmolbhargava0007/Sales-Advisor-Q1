import React, { useState } from "react";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayoutItems from "./MainLayoutItems"; // adjust path if needed

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme(); // if you want to use theme later
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <WorkspaceProvider>
      <MainLayoutItems
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
        isAuthenticated={isAuthenticated}
      >
        {children}
      </MainLayoutItems>
    </WorkspaceProvider>
  );
};

export default MainLayout;