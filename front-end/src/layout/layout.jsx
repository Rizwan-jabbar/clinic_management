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
          isCollapsed ? "lg:pl-20" : "lg:pl-[264px]"
        }`}
      >
        <Header
          setIsOpen={setIsOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-5 lg:px-6 lg:py-5">
          <div className="mx-auto min-w-0 max-w-[1380px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
