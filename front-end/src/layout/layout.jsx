import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sideBar";
import Header from "../components/header/header";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
      </div>

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`relative flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ${
          isCollapsed ? "lg:pl-24" : "lg:pl-[286px]"
        }`}
      >
        <Header
          setIsOpen={setIsOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto min-w-0 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
