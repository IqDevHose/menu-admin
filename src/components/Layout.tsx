import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sidebar component
import { Menu } from "lucide-react"; // Burger icon for mobile
import { useGlobalSidebar } from "@/store";

const Layout = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalSidebar();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 py-2">
            <button
              onClick={() => toggleSidebar(!isSidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-gray-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
