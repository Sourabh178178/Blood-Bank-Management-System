import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/common/Layout";
import PrivateRoute from "./components/common/PrivateRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import RegisterDonor from "./components/auth/RegisterDonor";
import RegisterHospital from "./components/auth/RegisterHospital";

// Protected Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import DonorDashboard from "./components/donor/Dashboard";
import DonorProfile from "./components/donor/Profile";
import DonorHistory from "./components/donor/History";
import HospitalDashboard from "./components/hospital/Dashboard";
import BloodRequest from "./components/hospital/BloodRequest";
import RequestHistory from "./components/hospital/RequestHistory";

// Admin Components
import BloodBankDashboard from "./components/bloodBank/BloodBankDashboard";
import BloodBankStatistics from "./components/bloodBank/BloodBankStatistics";
import BloodBankInventory from "./components/bloodBank/Inventory";
import BloodBankRequests from "./components/bloodBank/Requests";
import AdminDirectory from './components/bloodBank/AdminDirectroy';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register/donor" element={<RegisterDonor />} />
          <Route path="register/hospital" element={<RegisterHospital />} />

          {/* Protected Donor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
            <Route path="donor/dashboard" element={<DonorDashboard />} />
            <Route path="donor/profile" element={<DonorProfile />} />
            <Route path="donor/history" element={<DonorHistory />} />
          </Route>

          {/* Protected Hospital Routes */}
          <Route
            path="hospital"
            element={<PrivateRoute allowedRoles={["hospital"]} />}
          >
            <Route path="dashboard" element={<HospitalDashboard />} />
            <Route path="request-blood" element={<BloodRequest />} />
            <Route path="request-history" element={<RequestHistory />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="admin"
            element={<PrivateRoute allowedRoles={["admin"]} />}
          >
            <Route path="/admin/directory" element={<AdminDirectory />} />
            <Route path="dashboard" element={<BloodBankDashboard />} />
            <Route path="statistics" element={<BloodBankStatistics />} />
            <Route path="inventory" element={<BloodBankInventory />} />
            <Route path="requests" element={<BloodBankRequests />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
