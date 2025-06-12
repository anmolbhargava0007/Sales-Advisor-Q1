import React from "react";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Edit2, Menu, Plus } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import FreeTierModal from "@/components/FreeTierModal";

interface MainLayoutItemsProps {
    isMobile: boolean;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    isAuthenticated: boolean;
    children?: React.ReactNode;
  }

const MainLayoutItems = ({
    isMobile,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isAuthenticated,
    children,
}: MainLayoutItemsProps) => {
    const { clearChat } = useWorkspace();
    const { isAppValid } = useAuth();

    const [showFreeTierModal, setShowFreeTierModal] = React.useState(false);

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
        if (isMobile) {
            closeSidebar();
        }
    };

    return (
        <>
            <div className="font-poppins flex h-screen bg-background overflow-hidden">
                {/* Mobile Backdrop */}
                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={closeSidebar}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`
                      ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
                      transform transition-transform duration-300 ease-in-out
                      ${isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
                      ${isMobile ? "w-80" : "w-72"}
                    `}
                >
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

                            {/* New Chat button only when sidebar is hidden */}
                            {isMobile && !isSidebarOpen && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleNewChat}
                                    className="flex items-center gap-1 bg-gradient-to-br from-purple-500"
                                    title="New chat"
                                >
                                    <Edit2/>
                                </Button>
                            )}

                            <div className="flex items-center gap-2 md:gap-4">
                                {isAuthenticated && <UserMenu />}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">{children}</div>
                </div>
            </div>

            <FreeTierModal
                isOpen={showFreeTierModal}
                onClose={() => setShowFreeTierModal(false)}
            />
        </>
    );
};

export default MainLayoutItems;