import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice/userSlice";

const Header = ({ setIsOpen }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6">

      {/* Mobile Menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-gray-700 text-2xl"
      >
        ☰
      </button>

      {/* Title */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-700">
        Dashboard
      </h1>

      {/* Profile Dropdown */}
      <div
        className="relative group"
      >
        {/* Profile Trigger */}
        <div className="flex items-center gap-3 cursor-pointer">
          <span className="text-gray-600 hidden sm:block">
            {user?.name}
          </span>

          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
        </div>

        {/* Dropdown */}
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border 
                        opacity-0 invisible group-hover:visible group-hover:opacity-100
                        transition-all duration-200 z-50">

          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            My Profile
          </button>

          <button
            onClick={() => navigate("/appointments")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Appointments
          </button>

          <button
            onClick={() => navigate("/messages")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Messages
          </button>

          <hr />

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

        </div>
      </div>

    </div>
  );
};

export default Header;