import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex overflow-auto h-screen w-full bg-indigo-50/75">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
