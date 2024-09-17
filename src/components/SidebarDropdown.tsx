import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
  } from "../components/ui/dropdown-menu"; // Update the path as necessary
  import { NavLink } from "react-router-dom";
  import { Menu } from "lucide-react";
  
  const SidebarDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-white w-10 h-10 flex items-center text-sm gap-1 bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3">
            <Menu size={16} />
            <p className="hidden xl:inline">Menu</p>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <NavLink to="/" className="flex items-center gap-2">
                Admin Panel
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/restaurants" className="flex items-center gap-2">
                Restaurants
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/categories" className="flex items-center gap-2">
                Categories
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/items" className="flex items-center gap-2">
                Items
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/customerReviews" className="flex items-center gap-2">
                Customer Reviews
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/questions" className="flex items-center gap-2">
                Questions
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default SidebarDropdown;
  