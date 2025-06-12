
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <WorkspaceProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Mobile Backdrop */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          transform transition-transform duration-300 ease-in-out
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile ? 'w-80' : 'w-72'}
        `}>
          <Sidebar onClose={closeSidebar} isMobile={isMobile} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-gray-700 bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between p-3 md:p-4">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="h-8 w-8 p-0 text-white hover:bg-gray-700 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <h1 className="text-lg md:text-2xl font-semibold text-white truncate">
                  SalesAdvisor
                </h1>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                {isAuthenticated && <UserMenu />}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
};

export default MainLayout;
