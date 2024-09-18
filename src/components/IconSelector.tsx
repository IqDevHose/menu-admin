import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconSelectorPropsT, selectedIconT } from "@/utils/types";
import { iconOptions } from "@/utils/data";

export function IconSelector({ onIconSelect, initialIcon }: iconSelectorPropsT) {
  const [selectedIcon, setSelectedIcon] = useState<selectedIconT | null>(null);

  // Set the initial selected icon if it exists (useful for editing cases)
  useEffect(() => {
    if (initialIcon) {
      const icon = iconOptions.find((option) => option.title === initialIcon);
      if (icon) setSelectedIcon(icon);
    }
  }, [initialIcon]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedIcon ? selectedIcon.value : "Choose Icon ✨"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 grid grid-cols-4 gap-2 p-4">
        {iconOptions.map((icon) => (
          <DropdownMenuItem
            key={icon.title}
            onSelect={() => {
              onIconSelect(icon.title); // Pass the selected icon's title or value to the parent
              setSelectedIcon(icon); // Set the selected icon for the current state
            }}
            className="flex flex-col items-center justify-center"
          >
            {icon.value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default IconSelector;
