import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice/userSlice";
import { useState } from "react";

const Header = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/90 border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Mobile trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-slate-600 shadow-sm transition hover:bg-white md:hidden"
          aria-label="Open sidebar"
        >
          ☰
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="hidden h-8 w-8 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white sm:flex">
            CM
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Dashboard
            </p>
            <h1 className="text-lg font-semibold text-slate-800">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
          </div>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <span className="hidden text-sm text-slate-700 sm:inline">
              {user?.name}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold">
              {initials}
            </div>
          </button>

          <div
            className={`absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white shadow-lg transition-all ${
              menuOpen
                ? "visible opacity-100 translate-y-0"
                : "invisible opacity-0 -translate-y-2"
            }`}
          >
            <nav className="py-2 text-sm text-slate-600">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-50"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/appointments");
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-50"
              >
                Appointments
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/messages");
                }}
                className="block w-full px-4 py-2 text-left hover:bg-slate-50"
              >
                Messages
              </button>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;