
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Users } from "lucide-react";

const ROLE_MODULES = {
  "1": {
    modules: [
      { moduleId: 1, name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { moduleId: 3, name: "User Management", icon: Users, path: "/usermanagement" },
    ]
  },
  "2": {
    modules: [
      // { moduleId: 2, name: "New Chat", icon: Plus, path: "/workspace"},
    ]
  }
};

const SidebarNav = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const modules = ROLE_MODULES[userRole.toString()]?.modules || ROLE_MODULES["2"].modules;
  
  const handleModuleClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="flex flex-col space-y-2 p-2">
      {modules.map(module => (
        <div key={module.moduleId} className="w-full">
          <Button 
            variant="ghost"
            className={`w-full justify-start text-gray-200 ${location.pathname === module.path ? "bg-gray-700" : ""}`}
            onClick={() => handleModuleClick(module.path)}
          >
            <div className="flex items-center gap-2">
              {module.icon && <module.icon className="h-4 w-4" />}
              <span>{module.name}</span>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SidebarNav;
