import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDirectory = () => {
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [donorRes, hospitalRes] = await Promise.all([
          axios.get("/bloodbank/donors", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/bloodbank/hospitals", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDonors(donorRes.data);
        setHospitals(hospitalRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Registered Donors & Hospitals</h1>
      
      {/* Donors Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Donors</h2>
        <div className="overflow-x-auto">
        <table className="min-w-full w-full bg-white rounded-lg shadow-md border-collapse table-fixed">
  <thead>
    <tr>
      <th className="py-2 px-4 w-1/4 text-left border-b">Name</th>
      <th className="py-2 px-4 w-1/4 text-left border-b">Email</th>
      <th className="py-2 px-4 w-1/4 text-left border-b">Blood Type</th>
      <th className="py-2 px-4 w-1/4 text-left border-b">Phone</th>
    </tr>
  </thead>
  <tbody>
    {donors.map(donor => (
      <tr key={donor._id} className="hover:bg-gray-50">
        <td className="py-2 px-4 border-b">{donor.user?.name || '-'}</td>
        <td className="py-2 px-4 border-b">{donor.user?.email || '-'}</td>
        <td className="py-2 px-4 border-b">{donor.bloodType}</td>
        <td className="py-2 px-4 border-b">{donor.phone || '-'}</td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>

      {/* Hospitals Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hospitals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full w-full bg-white rounded-lg shadow-md border-collapse table-fixed">
            <thead>
              <tr>
                <th className="py-2 px-4 w-1/4 text-left border-b">Name</th>
                <th className="py-2 px-4 w-1/4 text-left border-b">Email</th>
                <th className="py-2 px-4 w-1/4 text-left border-b">Address</th>
                <th className="py-2 px-4 w-1/4 text-left border-b">Contact</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(hospital => (
                <tr key={hospital._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{hospital.user?.name || hospital.name || '-'}</td>
                  <td className="py-2 px-4 border-b">{hospital.user?.email || hospital.email || '-'}</td>
                  <td className="py-2 px-4 border-b">{hospital.address || '-'}</td>
                  <td className="py-2 px-4 border-b">{hospital.contact || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDirectory;
