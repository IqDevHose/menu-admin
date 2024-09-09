import { Cog, CloudDownload, CloudUpload } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
type DropdownMenuDemoType = {
  handleExport: () => void;
  link: string;
};
export function DropdownMenuDemo({ handleExport, link }: DropdownMenuDemoType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-white w-10 h-10 xl:w-auto flex items-center text-sm  gap-1 bg-gray-800 hover:bg-gray-900 font-medium rounded-lg py-2.5 px-3">
          <Cog size={16} />
          <p className="hidden xl:inline">Actions</p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={link}>
            <DropdownMenuItem>
              <CloudDownload className="mr-2 h-5 w-5" />
              Import
            </DropdownMenuItem>
          </Link>
          <label htmlFor="btn">
            <DropdownMenuItem>
              <CloudUpload className="mr-2 h-5 w-5" />
              <button id="btn" onClick={handleExport}>
                Export
              </button>
            </DropdownMenuItem>
          </label>
          <label htmlFor="print">
            {/* <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span id="print">Print</span>
            </DropdownMenuItem> */}
          </label>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
