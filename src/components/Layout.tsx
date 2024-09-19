import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sidebar component
import { MenuOutlined } from "@ant-design/icons"; // Burger icon for mobile
import { useGlobalSidebar } from "@/store";

const Layout = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalSidebar();

  return (
    <div className="relative flex h-screen">
      {/* Sidebar for both desktop and mobile views */}
      <Sidebar />

      {/* Background overlay (only visible on mobile when sidebar is open) */}
      {isSidebarOpen && (
        <div
          onClick={()=>toggleSidebar(!isSidebarOpen)}
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col  h-screen w-full bg-white  ">
        {/* Top bar with burger icon to toggle sidebar on mobile */}
        <div className="px-8 py-2 flex items-center lg:hidden">
          <div className="block lg:hidden">
            <MenuOutlined
              onClick={()=>toggleSidebar(!isSidebarOpen)}
              className="text-xl text-gray-800 cursor-pointer"
            />
          </div>
        </div>

        {/* Main content rendered by the router */}
        <div className="flex-1 p-1 md:p-6 overflow-scroll ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
