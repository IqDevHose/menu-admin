import { 
    FaUtensils, FaPizzaSlice, FaHamburger, FaIceCream, FaCoffee, FaCocktail, FaFish, FaLeaf, FaWineBottle, 
    FaConciergeBell, FaAppleAlt, FaBreadSlice, FaDrumstickBite, FaPepperHot, FaBeer, FaCheese, FaCarrot, 
    FaShoppingCart, FaGift, FaCashRegister, 
    FaBlender, FaMugHot, FaCandyCane, FaEgg, FaCookieBite, FaGlassMartiniAlt, FaLemon, FaBacon, 
    FaHotdog, FaCookie, FaBox, FaTruck, FaTrophy, FaClipboardList, FaBalanceScale, FaWarehouse, FaPercentage, 
    FaTruckLoading, FaTruckMoving 
  } from "react-icons/fa";

export const iconOptions = [
    { title: "Utensils", value: <FaUtensils className="h-4 w-4" /> },
    { title: "Pizza", value: <FaPizzaSlice className="h-4 w-4" /> },
    { title: "Hamburger", value: <FaHamburger className="h-4 w-4" /> },
    { title: "Ice Cream", value: <FaIceCream className="h-4 w-4" /> },
    { title: "Coffee", value: <FaCoffee className="h-4 w-4" /> },
    { title: "Cocktail", value: <FaCocktail className="h-4 w-4" /> },
    { title: "Fish", value: <FaFish className="h-4 w-4" /> },
    { title: "Vegan", value: <FaLeaf className="h-4 w-4" /> },
    { title: "Wine", value: <FaWineBottle className="h-4 w-4" /> },
    { title: "Service", value: <FaConciergeBell className="h-4 w-4" /> },
    { title: "Fruit", value: <FaAppleAlt className="h-4 w-4" /> },
    { title: "Bread", value: <FaBreadSlice className="h-4 w-4" /> },
    { title: "Chicken", value: <FaDrumstickBite className="h-4 w-4" /> },
    { title: "Spicy", value: <FaPepperHot className="h-4 w-4" /> },
    { title: "Beer", value: <FaBeer className="h-4 w-4" /> },
    { title: "Cheese", value: <FaCheese className="h-4 w-4" /> },
    { title: "Carrot", value: <FaCarrot className="h-4 w-4" /> },
    { title: "Cart", value: <FaShoppingCart className="h-4 w-4" /> },
    { title: "Gift", value: <FaGift className="h-4 w-4" /> },
    { title: "Cash Register", value: <FaCashRegister className="h-4 w-4" /> },
    { title: "Blender", value: <FaBlender className="h-4 w-4" /> },
    { title: "Hot Mug", value: <FaMugHot className="h-4 w-4" /> },
    { title: "Candy", value: <FaCandyCane className="h-4 w-4" /> },
    { title: "Egg", value: <FaEgg className="h-4 w-4" /> },
    { title: "Cookie Bite", value: <FaCookieBite className="h-4 w-4" /> },
    { title: "Martini", value: <FaGlassMartiniAlt className="h-4 w-4" /> },
    { title: "Lemon", value: <FaLemon className="h-4 w-4" /> },
    { title: "Bacon", value: <FaBacon className="h-4 w-4" /> },
    { title: "Hot Dog", value: <FaHotdog className="h-4 w-4" /> },
    { title: "Cookie", value: <FaCookie className="h-4 w-4" /> },
    { title: "Box", value: <FaBox className="h-4 w-4" /> },
    { title: "Delivery Truck", value: <FaTruck className="h-4 w-4" /> },
    { title: "Trophy", value: <FaTrophy className="h-4 w-4" /> },
    { title: "Order List", value: <FaClipboardList className="h-4 w-4" /> },
    { title: "Scale", value: <FaBalanceScale className="h-4 w-4" /> },
    { title: "Warehouse", value: <FaWarehouse className="h-4 w-4" /> },
    { title: "Discount", value: <FaPercentage className="h-4 w-4" /> },
    { title: "Loading Truck", value: <FaTruckLoading className="h-4 w-4" /> },
    { title: "Moving Truck", value: <FaTruckMoving className="h-4 w-4" /> }
  ];


  export const getIconByTitle = (title: string) => {
    return iconOptions.find(icon => icon.title === title) || null;
  };