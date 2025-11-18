import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/donations", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowForm(false);
      setMessage("Donation recorded successfully!");
      setFormData({ date: "", location: "", quantity: "" });
      // Optionally redirect to history page after donation
      // navigate("/donor/history");
    } catch (err) {
      setMessage(err.response?.data?.message || "Donation failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {showForm ? "Cancel" : "New Donation"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (ml)
                </label>
                <input
                  type="number"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                Confirm Donation
              </button>
            </div>
          </form>
        )}
        {message && (
          <div className="p-4 bg-blue-100 text-blue-700 rounded">{message}</div>
        )}

        {/* Add navigation to the history page */}
        <div className="mt-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/donor/history")}
          >
            View Donation History
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
