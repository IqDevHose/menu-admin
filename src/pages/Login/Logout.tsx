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
      className="px-2 py-3  text-sm font-medium text-white bg-red-600 border  border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <SquareArrowLeft className="inline mr-6   " />
     LOG OUT   {"  "}
    </button>
  );
}

export default Logout;
