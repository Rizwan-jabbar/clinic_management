import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { useEffect } from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const role = user?.role
  const lowerCaeseRole = role?.toLowerCase();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isOpen ? "w-64" : "w-20"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className={`${isOpen ? "block" : "hidden"} font-bold text-lg`}>
            {role === "admin" ? "Admin Panel" : "Doctor Panel"}
          </h1>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hidden md:block"
          >
            ☰
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="text-white md:hidden"
          >
            ✕
          </button>
        </div>

        {/* ===== LINKS ===== */}
        <nav className="flex flex-col p-4 gap-3">

          {/* ✅ Admin Links */}
          {
           lowerCaeseRole !== "doctor"  && (
            <>
              <NavLink
                to="/clinics"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                🏥 {isOpen && "Clinics"}
              </NavLink>
             {
              user.role === "user" && (

                <NavLink
                to="/myAppointments"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
                >
                 📅 {isOpen && "Book Appointment"}
              </NavLink>
              )
              }

              <NavLink
                to="/doctors"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                👨‍⚕️ {isOpen && "Doctors"}
              </NavLink>
            </>
          )}

          {/* ✅ Doctor Links */}
          {lowerCaeseRole === "doctor"  && (
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                👤 {isOpen && "My Profile"}
              </NavLink>

              <NavLink
                to="/myAppointments"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                📅 {isOpen && "Appointments"}
              </NavLink>
              <NavLink
                to="/messages"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                💬 {isOpen && "Messages"}
              </NavLink>
              <NavLink
                to="/myPatients"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  }`
                }
              >
                👥 {isOpen && "My Patients"}
              </NavLink>
            </>
          )}

        </nav>
      </div>
    </>
  );
};

export default Sidebar;