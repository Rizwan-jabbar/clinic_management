import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userThunk/userThunk";
function Login() {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-800">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[380px]">

        <h2 className="text-2xl font-bold text-center text-blue-800">
          Clinic Management
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 Clinic Management System
        </p>

      </div>
    </div>
  );
}

export default Login;