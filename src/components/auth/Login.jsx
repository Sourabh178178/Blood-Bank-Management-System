import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const { login, error, clearErrors } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleLogin = async (role) => {
    clearErrors();
    setSelectedRole(role);
    try {
      await login(formData.email, formData.password, role);
      // Redirect handled in AuthContext
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {Array.isArray(error.errors)
              ? error.errors.map((err, idx) => <p key={idx}>{err.msg}</p>)
              : error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleRoleLogin("donor")}
              className={`w-full py-2 px-4 rounded-md shadow text-sm font-semibold text-white transition-colors duration-200
    ${
      selectedRole === "donor"
        ? "bg-gradient-to-r from-rose-500 to-red-600 shadow-lg"
        : "bg-rose-400"
    }
    hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400`}
            >
              Login as Donor
            </button>
            <button
              type="button"
              onClick={() => handleRoleLogin("hospital")}
              className={`w-full py-2 px-4 rounded-md shadow text-sm font-semibold text-white transition-colors duration-200
    ${
      selectedRole === "hospital"
        ? "bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg"
        : "bg-sky-400"
    }
    hover:bg-gradient-to-r hover:from-sky-600 hover:to-blue-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400`}
            >
              Login as Hospital
            </button>
            <button
              type="button"
              onClick={() => handleRoleLogin("admin")}
              className={`w-full py-2 px-4 rounded-md shadow text-sm font-semibold text-white transition-colors duration-200
    ${
      selectedRole === "admin"
        ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg"
        : "bg-emerald-400"
    }
    hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400`}
            >
              Login as Admin
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register/donor"
            className="font-medium text-red-600 hover:text-red-500"
          >
            Register as donor
          </Link>{" "}
          or{" "}
          <Link
            to="/register/hospital"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register as hospital
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
