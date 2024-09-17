import { Cloud, CreditCard, Github, Keyboard, LifeBuoy, LogOut, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

  export function IconSelector() {
    const iconOptions = [
      { title: "User", value: <User className="h-4 w-4" /> },
      { title: "Credit Card", value: <CreditCard className="h-4 w-4" /> },
      { title: "Github", value: <Github className="h-4 w-4" /> },
      { title: "Keyboard", value: <Keyboard className="h-4 w-4" /> },
      { title: "LifeBuoy", value: <LifeBuoy className="h-4 w-4" /> },
      { title: "LogOut", value: <LogOut className="h-4 w-4" /> },
      { title: "Mail", value: <Mail className="h-4 w-4" /> },
      { title: "Message Square", value: <MessageSquare className="h-4 w-4" /> },
      { title: "Plus", value: <Plus className="h-4 w-4" /> },
      { title: "Plus Circle", value: <PlusCircle className="h-4 w-4" /> },
      { title: "Settings", value: <Settings className="h-4 w-4" /> },
      { title: "User Plus", value: <UserPlus className="h-4 w-4" /> },
      { title: "Users", value: <Users className="h-4 w-4" /> },
      { title: "Cloud", value: <Cloud className="h-4 w-4" /> },
    ];
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Chose Icon ✨</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 grid grid-cols-4 gap-2 p-4">
          {iconOptions.map((icon) => (
            <DropdownMenuItem key={icon.title} className="flex  flex-col items-center justify-center">
              {icon.value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  export default IconSelector