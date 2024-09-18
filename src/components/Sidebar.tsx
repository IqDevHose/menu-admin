import {
  ChartBarStacked,
  ChefHat,
  FileQuestion,
  LayoutDashboard,
  MessageCircleCode,
  ShoppingBasket,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logout from "@/pages/Login/Logout";
import { useGlobalSidebar } from "@/store";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalSidebar();

  return (
    <aside
      id="separator-sidebar"
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } lg:block fixed top-0 left-0 lg:relative z-50 w-80 h-screen bg-[#F3F8FF]`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto">
        <div className="flex flex-col">
          {/* Close button visible on mobile */}
          <div className="flex justify-end mb-4 lg:hidden">
            <button onClick={()=>toggleSidebar(!isSidebarOpen)}>
              <X className="text-gray-800 cursor-pointer" size={24} />
            </button>
          </div>

          <ul className="space-y-2 font-medium">
            {/* Admin Panel */}
            <li className="mb-3">
              <NavLink
                to="/"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-800"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200 shadow"
                }
              >
                <LayoutDashboard />
                <span className="ml-3">Admin Panel</span>
              </NavLink>
            </li>

            {/* Restaurants */}
            <li>
              <NavLink
                to="/restaurants"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <ChefHat />
                <span className="ml-3">Restaurants</span>
              </NavLink>
            </li>

            {/* Categories */}
            <li>
              <NavLink
                to="/categories"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <ChartBarStacked />
                <span className="ml-3">Categories</span>
              </NavLink>
            </li>

            {/* Items */}
            <li>
              <NavLink
                to="/items"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <ShoppingBasket />
                <span className="ml-3">Items</span>
              </NavLink>
            </li>

            {/* Customer Reviews */}
            <li>
              <NavLink
                to="/customerReviews"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <MessageCircleCode />
                <span className="ml-3">Customer Reviews</span>
              </NavLink>
            </li>

            {/* Questions */}
            <li>
              <NavLink
                to="/questions"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <FileQuestion />
                <span className="ml-3">Questions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/offer"
                onClick={()=>toggleSidebar(!isSidebarOpen)} // Close sidebar on item click
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-500"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200"
                }
              >
                <MessageCircleCode />
                <span className="ml-3">Offer</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout button */}
        <div className="flex flex-col">
          <Logout />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
