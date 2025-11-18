import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to BloodBank Management System</h1>
      <p className="text-lg text-gray-700 mb-8">
        Join us in saving lives. Donate blood, request blood, or manage your blood bank inventory efficiently and securely.
      </p>
      <div className="space-x-4">
        <Link to="/register/donor" className="bg-primary text-white px-6 py-3 rounded hover:bg-red-700 font-bold">Register as Donor</Link>
        <Link to="/register/hospital" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-bold">Register as Hospital</Link>
        <Link to="/login" className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-900 font-bold">Login</Link>
      </div>
    </div>
  </div>
);

export default Home;
