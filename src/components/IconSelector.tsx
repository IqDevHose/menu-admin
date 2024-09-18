import { 
  FaUtensils, FaPizzaSlice, FaHamburger, FaIceCream, FaCoffee, FaCocktail, FaFish, FaLeaf, FaWineBottle, 
  FaConciergeBell, FaAppleAlt, FaBreadSlice, FaDrumstickBite, FaPepperHot, FaBeer, FaCheese, FaCarrot, 
  FaShoppingCart, FaGift, FaCashRegister 
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconSelectorPropsT } from "@/utils/types";
import { iconOptions } from "@/utils/data";
import React, { useState } from "react";


type selectedIconT = {
  title:string
  value: React.ReactNode
}

  export function IconSelector({onIconSelect}: iconSelectorPropsT) {
    const [selectedIcon, setSelectedIcon] = useState<selectedIconT | null>(null)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{selectedIcon ? selectedIcon.value : 'Chose Icon ✨' }</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 grid grid-cols-4 gap-2 p-4">
          {iconOptions.map((icon) => (
            <DropdownMenuItem  onSelect={() => {
              onIconSelect(icon.title)
              setSelectedIcon(icon)
              }} key={icon.title} className="flex  flex-col items-center justify-center">
              {icon.value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  export default IconSelector