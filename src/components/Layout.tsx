import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sidebar component
import { MenuOutlined } from "@ant-design/icons"; // Burger icon for mobile
import useGlobalSidebar from "../../store/index"; // Zustand store for global state

const Layout = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalSidebar();

  return (
    <div className="relative flex h-screen">
      {/* Sidebar for both desktop and mobile views */}
      <Sidebar />

      {/* Background overlay (only visible on mobile when sidebar is open) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        {/* Top bar with burger icon to toggle sidebar on mobile */}
        <div className="p-4 flex items-center bg-gray-100">
          <div className="block md:hidden">
            <MenuOutlined
              onClick={toggleSidebar}
              className="text-xl text-gray-800 cursor-pointer"
            />
          </div>
        </div>

        {/* Main content rendered by the router */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
