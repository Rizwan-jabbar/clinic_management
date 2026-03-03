import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sideBar";
import Header from "../components/header/header";
const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden relative">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Right Section */}
      <div className="flex-1 flex flex-col h-full">

        <Header setIsOpen={setIsOpen} />

        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Layout;