import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  Plus,
  ShoppingCart,
  Stethoscope,
  User,
  UserCog,
  UserRound,
  Users,
  X,
} from "lucide-react";

const baseLinkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
    isActive
      ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md shadow-sky-500/20"
      : "text-slate-600 hover:bg-sky-50/90 hover:text-sky-700"
  }`;

const subLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
    isActive
      ? "bg-sky-50 text-sky-700"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
  }`;

const sidebarGroups = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      title: "Clinics",
      icon: Building2,
      links: [
        { to: "/clinics", label: "All Clinics", icon: Building2 },
        { to: "/addClinic", label: "Add Clinic", icon: Plus },
      ],
    },
    {
      title: "Doctors",
      icon: Stethoscope,
      links: [
        { to: "/doctors", label: "All Doctors", icon: Stethoscope },
        { to: "/addDoctor", label: "Add Doctor", icon: Plus },
      ],
    },
    {
      title: "Pharmacy",
      icon: ClipboardList,
      links: [
        { to: "/pharmacyList", label: "Pharmacy List", icon: ClipboardList },
        { to: "/addPharmacy", label: "Add Pharmacy", icon: Plus },
      ],
    },
    {
      title: "Medicines",
      icon: Pill,
      links: [
        { to: "/allMedicine", label: "Medicine Inventory", icon: Pill },
        { to: "/addMedicine", label: "Add Medicine", icon: Plus },
      ],
    },
    {
      title: "Payments",
      icon: Package,
      links: [
        { to: "/payments", label: "All Payments", icon: Package },
        { to: "/addPayment", label: "Add Payment", icon: Plus },
      ],
    },
    { to: "/admin/orders", label: "All Orders", icon: ShoppingCart },
  ],
  user: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      title: "Explore",
      icon: Building2,
      links: [
        { to: "/clinics", label: "Clinics", icon: Building2 },
        { to: "/doctors", label: "Doctors", icon: Stethoscope },
        { to: "/allMedicine", label: "Medicines", icon: Pill },
      ],
    },
    { to: "/myAppointments", label: "My Appointments", icon: CalendarClock },
    {
      to: "/myAppointmentRequests",
      label: "Appointment Requests",
      icon: ClipboardList,
    },
    { to: "/myOrders", label: "My Orders", icon: ShoppingCart },
    { to: "/profile", label: "My Profile", icon: User },
  ],
  doctor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
    { to: "/messages", label: "Messages", icon: Users },
    { to: "/myPatients", label: "My Patients", icon: UserRound },
    { to: "/myAssistant", label: "My Assistants", icon: UserCog },
    { to: "/addAssistant", label: "Add Assistant", icon: Plus },
  ],
  assistant: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/appointmentRequests",
      label: "Appointment Requests",
      icon: ClipboardList,
    },
    { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
  ],
  pharmacy: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/addMedicine", label: "Add Medicine", icon: Plus },
    { to: "/medicines", label: "Medicine Stock", icon: Package },
    { to: "/pharmacy/orders", label: "Orders", icon: ShoppingCart },
    { to: "/profile", label: "My Profile", icon: User },
  ],
};

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.user);
  const [openDropdown, setOpenDropdown] = useState(null);

  const role = user?.role?.toLowerCase() || "";
  const items = role ? sidebarGroups[role] || [] : [];

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const resize = () => setIsOpen(window.innerWidth >= 1024);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [setIsOpen]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r border-slate-200/80 bg-white/90 shadow-xl shadow-slate-300/20 backdrop-blur-md transition-[width,transform] duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-[264px]"} lg:translate-x-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-[264px]"
        }`}
      >
        <div className="flex h-full flex-col">
          <div
            className={`border-b border-slate-200/80 py-4 ${
              isCollapsed ? "px-3" : "px-5"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-teal-500 text-sm font-semibold text-white shadow-md shadow-sky-500/20">
                  CM
                </div>
                {!isCollapsed && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700/70">
                      Clinic Care
                    </p>
                    <p className="text-sm font-semibold text-slate-800 capitalize">
                      {role || (loading ? "Loading" : "Workspace")}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:hidden"
              >
                <X size={18} />
              </button>

              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:inline-flex"
              >
                {isCollapsed ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </button>
            </div>
          </div>

          <div className={`${isCollapsed ? "px-3" : "px-4"} pt-4`}>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-3 text-slate-600">
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
                <Stethoscope size={16} className="text-sky-700" />
                {!isCollapsed && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Navigation</p>}
              </div>
            </div>
          </div>

          <nav
            className={`flex-1 space-y-2.5 overflow-y-auto py-4 ${
              isCollapsed ? "px-3" : "px-4"
            }`}
          >
            {items.map((item) => {
              if (item.links) {
                const GroupIcon = item.icon;
                const isActive = openDropdown === item.title;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/80 bg-white p-1.5"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        isCollapsed
                          ? handleNavClick()
                          : setOpenDropdown((prev) =>
                              prev === item.title ? null : item.title
                            )
                      }
                      className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${
                        isCollapsed ? "justify-center" : "gap-3"
                      }`}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <span className="rounded-lg bg-sky-50 p-2 text-sky-700">
                        <GroupIcon size={18} />
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          <ChevronDown
                            size={16}
                            className={`transition ${isActive ? "rotate-180 text-sky-700" : "text-slate-400"}`}
                          />
                        </>
                      )}
                    </button>

                    {isActive && !isCollapsed && (
                      <div className="mt-1 space-y-1 px-1 pb-1">
                        {item.links.map((link) => {
                          const Icon = link.icon;
                          return (
                            <NavLink
                              key={link.to}
                              to={link.to}
                              onClick={handleNavClick}
                              className={subLinkClass}
                            >
                              <Icon size={16} />
                              {link.label}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `${baseLinkClass({ isActive })} ${
                      isCollapsed ? "justify-center px-2" : ""
                    }`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="rounded-lg bg-white/80 p-2 shadow-sm shadow-slate-200/30">
                    <Icon size={18} />
                  </span>
                  {!isCollapsed && item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
