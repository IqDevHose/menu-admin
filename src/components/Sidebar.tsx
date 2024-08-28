import {
  ChartBarStacked,
  ChefHat,
  FileQuestion,
  LayoutDashboard,
  MessageCircleCode,
  ShieldBan,
  ShoppingBasket,
  Star,
  SunMoon,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <aside
        id="separator-sidebar"
        className="w-80 h-screen "
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-indigo-100">
          <ul className="space-y-2 font-medium">
            <li className="mb-3">
              <NavLink
                to={"/"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg bg-indigo-800 "
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200 shadow"
                }
              >
                <LayoutDashboard />
                <span className="ms-3">Admin panal</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/restaurants"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <ChefHat />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Restaurant
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/categories"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <ChartBarStacked />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Category
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/items"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <ShoppingBasket />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Items
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/customerReviews"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <MessageCircleCode />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Customer Review
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/ratings"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <Star />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Rating
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/questions"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <FileQuestion />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Questions
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/themes"}
                className={(navData) =>
                  navData.isActive
                    ? "flex items-center p-2 text-white rounded-lg  bg-indigo-500 group"
                    : "flex items-center p-2 text-indigo-900 rounded-lg hover:bg-indigo-200  group "
                }
              >
                <SunMoon />
                <span className="text-start flex-1 ms-3 whitespace-nowrap">
                  Theme
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
