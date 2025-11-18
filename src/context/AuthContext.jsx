import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Create context
const AuthContext = createContext();

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configure axios defaults (Set to your backend port)
  axios.defaults.baseURL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // 3. Token management
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  // 4. Load user data
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setAuthToken(token);
      // No /api prefix here, because baseURL already has /api
      const res = await axios.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, [token]);

  // 5. Login function
  const login = async (email, password, role) => {
    try {
      const res = await axios.post("/auth/login", { email, password, role });
      if (!res.data || !res.data.user || !res.data.user.role) {
        setError("Login failed: Invalid response from server.");
        throw new Error("Login failed: Invalid response from server.");
      }
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthToken(res.data.token);

      // Use the role from the response
      navigate(`/${res.data.user.role}/dashboard`);
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  // 6. Registration function
  const register = async (formData, role) => {
    try {
      const endpoint = `/auth/register/${role}`;
      const res = await axios.post(endpoint, formData);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate(`/${role}/dashboard`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // 7. Logout function
  const logout = () => {
    setToken("");
    setUser(null);
    setAuthToken(null);
    navigate("/login");
  };

  // 8. Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 9. Custom hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
