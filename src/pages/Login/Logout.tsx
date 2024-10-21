import { useNavigate } from "react-router-dom";

import { SquareArrowLeft } from "lucide-react";

function Logout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center p-2 text-indigo-100 rounded-lg hover:bg-red-800 group transition-colors duration-300"
    >
      <SquareArrowLeft className="mr-2 mb-[2px]"/>
      LOG OUT
    </button>
  );
}

export default Logout;
