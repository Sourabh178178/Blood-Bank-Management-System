import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const BloodBankDashboard = () => {
  const [stats, setStats] = useState({
    bloodTypeDistribution: [], // Initialize with empty array
    totalDonations: 0,
    totalDistributions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/bloodbank/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setStats({ bloodTypeDistribution: [], totalDonations: 0, totalDistributions: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const radarData = {
    labels: stats.bloodTypeDistribution?.map(item => item.bloodType) || [],
    datasets: [
      {
        label: 'Donations',
        data: stats.bloodTypeDistribution?.map(item => item.donations) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Distributions',
        data: stats.bloodTypeDistribution?.map(item => item.distributions) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blood Bank Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Donations</h3>
              <p className="text-3xl font-bold text-primary">{stats.totalDonations}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Distributions</h3>
              <p className="text-3xl font-bold text-primary">{stats.totalDistributions}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Blood Type Performance</h2>
            <div className="h-96">
              {stats.bloodTypeDistribution?.length > 0 ? (
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                  }}
                />
              ) : (
                <p className="text-gray-500">No blood type data available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BloodBankDashboard;
