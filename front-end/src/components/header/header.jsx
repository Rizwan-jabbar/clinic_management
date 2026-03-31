import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice/userSlice";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getCart } from "../../redux/cartThunk/cartThunk";
import {
  changeNotificationStatus,
  getPatientNotifications,
} from "../../redux/patientNotificationThunk/patientNotificationThunk";
import {
  Bell,
  CalendarRange,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  LogOut,
  Menu,
  ShoppingCart,
  User,
} from "lucide-react";
import NotificationModal from "./notificationModel";

const Header = ({ setIsOpen, isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { notifications } = useSelector((state) => state.patientNotification);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const roleLabel = user?.role?.toLowerCase() || "user";
  const currentUserNotification =
    notifications?.filter((n) => n.patientId === user?._id) || [];

  const unreadCount =
    currentUserNotification?.filter((n) => n?.isRead === false)?.length || 0;
  const cartCount = cart?.items?.length || 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getPatientNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (roleLabel === "user") {
      dispatch(getCart());
    }
  }, [dispatch, roleLabel]);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] min-w-0 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700 md:hidden"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700 lg:inline-flex"
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 sm:flex">
              CM
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700/70">
                Clinic Dashboard
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold text-slate-900">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm xl:flex xl:items-center xl:gap-3">
            <div className="rounded-xl bg-sky-50 p-2 text-sky-700">
              <CalendarRange size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Daily Care
              </p>
              <p className="truncate text-sm font-medium text-slate-700">
                Simple tools for clinic work
              </p>
            </div>
          </div>

          {roleLabel === "user" && (
            <button
              onClick={() => navigate("/myCart")}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 transition-all duration-200 ${
                notificationOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <p className="mt-1 text-xs text-slate-500">
                  Recent patient and clinic updates
                </p>
              </div>

              {currentUserNotification.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              )}

              {currentUserNotification.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    dispatch(changeNotificationStatus(item._id));
                    setSelectedNotification(item);
                    setNotificationOpen(false);
                  }}
                  className={`block w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-sky-50/60 ${
                    item?.isRead === false ? "bg-sky-50/70" : "bg-white"
                  }`}
                >
                  <p className="text-sm font-medium text-slate-700">
                    {`${item?.message} by ${item.assistantId.name}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item?.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-sky-200"
            >
              <div className="hidden text-right sm:block">
                <p className="font-semibold text-slate-800">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">Manage your account</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 font-semibold text-white shadow-md shadow-sky-500/20">
                {initials}
              </div>
              <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
            </button>

            <div
              className={`absolute right-0 mt-3 w-60 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 transition-all duration-200 ${
                menuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <nav className="p-2 text-sm">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                >
                  <User size={16} />
                  My Profile
                </button>

                {roleLabel === "user" && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/myOrders");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                  >
                    <ShoppingCart size={16} />
                    My Orders
                  </button>
                )}

                {roleLabel === "user" && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/myMedicalHistory");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                  >
                    <FileText size={16} />
                    Medical History
                  </button>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/myAppointments");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                >
                  <CalendarRange size={16} />
                  Appointments
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => {
            setSelectedNotification(null);
          }}
        />
      )}
    </header>
  );
};

export default Header;
