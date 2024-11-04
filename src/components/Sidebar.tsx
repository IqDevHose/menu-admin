import {
  ChartBarStacked,
  ChefHat,
  FileQuestion,
  Globe2,
  LayoutDashboard,
  MessageCircleCode,
  ShoppingBasket,
  Tag,
  TicketPercent,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logout from "@/pages/Login/Logout";
import { useGlobalSidebar } from "@/store";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalSidebar();

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => toggleSidebar(false)}
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 h-screen transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:w-80
          bg-gray-800 text-white
        `}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto">
          <div className="flex flex-col">
            {/* Close button visible on mobile */}
            <div className="flex justify-end mb-4 lg:hidden">
              <button onClick={() => toggleSidebar(false)} className="text-white hover:text-indigo-200">
                <X size={24} />
              </button>
            </div>

            {/* Logo or brand name */}
            <div className="text-2xl font-bold mb-6 text-center">
              Admin Panel
            </div>

            <ul className="space-y-2">
              {[
                { to: "/", icon: <LayoutDashboard />, label: "Dashboard" },
                { to: "/restaurants", icon: <ChefHat />, label: "Restaurants" },
                { to: "/categories", icon: <ChartBarStacked />, label: "Categories" },
                { to: "/items", icon: <ShoppingBasket />, label: "Items" },
                { to: "/customerReviews", icon: <MessageCircleCode />, label: "Customer Reviews" },
                { to: "/questions", icon: <FileQuestion />, label: "Questions" },
                { to: "/offers", icon: <TicketPercent />, label: "Offers" },
                { to: "/deals", icon: <Tag />, label: "Deals" },
                { to: "/translation/add", icon: <Globe2 />, label: "Translation" },

              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => toggleSidebar(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors duration-200 
                      ${isActive
                        ? "bg-white text-indigo-800"
                        : "text-white hover:bg-indigo-500"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout button */}
          <div className="mt-auto">
            <Logout />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
