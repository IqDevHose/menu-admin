import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "antd";

const Layout = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex overflow-auto h-screen w-full bg-white">
        <Menu className="bg-indigo-100 size-9 block md:hidden rounded p-2" />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
