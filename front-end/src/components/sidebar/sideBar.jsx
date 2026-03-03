import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { useEffect } from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const role = user?.role;
  const lowerCaseRole = role?.toLowerCase();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Auto-expand on desktop, collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all
     ${
       isActive
         ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
         : "text-slate-200 hover:text-white hover:bg-white/10"
     }`;

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen bg-slate-900/70 text-white transition-all duration-300 z-50 backdrop-blur-3xl border-r border-white/10
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-semibold shadow-lg shadow-blue-500/30">
                  CM
                </div>
                <div className={`${isOpen ? "flex flex-col" : "hidden"} text-sm`}>
                  <span className="font-semibold text-white">
                    {role === "admin"
                      ? "Admin Panel"
                      : role === "doctor"
                      ? "Doctor Panel"
                      : "Clinic Panel"}
                  </span>
                  <span className="text-xs text-slate-300 capitalize">{role}</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden md:flex items-center justify-center rounded-full border border-white/20 p-2 text-white hover:bg-white/10 transition"
                aria-label="Toggle sidebar"
              >
                {isOpen ? "⟨" : "⟩"}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden text-white text-xl"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-4">
              {lowerCaseRole !== "doctor" && (
                <>
                  <NavLink to="/clinics" onClick={() => setIsOpen(false)} className={linkClasses}>
                    <span className="text-lg">🏥</span>
                    {isOpen && <span>Clinics</span>}
                  </NavLink>

                  {role === "user" && (
                    <NavLink
                      to="/myAppointments"
                      onClick={() => setIsOpen(false)}
                      className={linkClasses}
                    >
                      <span className="text-lg">📅</span>
                      {isOpen && <span>Book Appointment</span>}
                    </NavLink>
                  )}

                  <NavLink to="/doctors" onClick={() => setIsOpen(false)} className={linkClasses}>
                    <span className="text-lg">👨‍⚕️</span>
                    {isOpen && <span>Doctors</span>}
                  </NavLink>
                </>
              )}

              {lowerCaseRole === "doctor" && (
                <>
                  <NavLink to="/profile" onClick={() => setIsOpen(false)} className={linkClasses}>
                    <span className="text-lg">👤</span>
                    {isOpen && <span>My Profile</span>}
                  </NavLink>

                  <NavLink
                    to="/myAppointments"
                    onClick={() => setIsOpen(false)}
                    className={linkClasses}
                  >
                    <span className="text-lg">📅</span>
                    {isOpen && <span>Appointments</span>}
                  </NavLink>

                  <NavLink to="/messages" onClick={() => setIsOpen(false)} className={linkClasses}>
                    <span className="text-lg">💬</span>
                    {isOpen && <span>Messages</span>}
                  </NavLink>

                  <NavLink to="/myPatients" onClick={() => setIsOpen(false)} className={linkClasses}>
                    <span className="text-lg">👥</span>
                    {isOpen && <span>My Patients</span>}
                  </NavLink>
                </>
              )}
            </nav>

            {/* Bottom toggle for mobile */}
            <div className="md:hidden p-4 border-t border-white/10">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full rounded-2xl bg-white/10 text-white py-2 font-medium hover:bg-white/20 transition"
              >
                {isOpen ? "Collapse" : "Expand"} Menu
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;