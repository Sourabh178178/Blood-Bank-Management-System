import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(199, 199, 199, 0.6)',
  'rgba(83, 102, 255, 0.6)'
];

const BloodBankStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/bloodbank/statistics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  // Pie chart for distributions
  const distributionPieData = {
    labels: stats.distributionStats.map(item => item._id),
    datasets: [
      {
        label: 'Distributed Units',
        data: stats.distributionStats.map(item => item.total),
        backgroundColor: COLORS,
        borderWidth: 1
      }
    ]
  };

  // Pie chart for donations (optional)
  const donationPieData = {
    labels: stats.donationStats.map(item => item._id),
    datasets: [
      {
        label: 'Donated Units',
        data: stats.donationStats.map(item => item.total),
        backgroundColor: COLORS,
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blood Bank Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Total Donations: {stats.totalDonations}
          </h2>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Total Distributions: {stats.totalDistributions}
          </h2>
          
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Registered Hospitals: {stats.totalHospitals}
          </h2>
          <h2 className="text-xl font-semibold text-gray-700">
            Active Donors: {stats.totalDonors}
          </h2>
        </div>
      </div>

      {/* Pie Chart for Distributions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribution by Blood Type</h2>
        <div className="h-96">
          <Pie
            data={distributionPieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Distributed Blood Types'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Pie Chart for Donations (optional, but recommended) */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Donation by Blood Type</h2>
        <div className="h-96">
          <Pie
            data={donationPieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Donated Blood Types'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {stats.recentRequests.map(request => (
            <div key={request._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{request.hospital?.name || 'Unknown Hospital'}</p>
                  <p className="text-gray-600">{request.bloodType} - {request.quantity} Units</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloodBankStatistics;
