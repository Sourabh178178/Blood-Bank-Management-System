import React from 'react';

const Contact = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
    <p className="text-gray-700 mb-4">
      Have questions or need assistance? Reach out to us!
    </p>
    <ul className="text-gray-700">
      <li>Email: <a href="mailto:info@bloodbank.com" className="text-primary underline">info@bloodbank.com</a></li>
      <li>Phone: <a href="tel:1234567890" className="text-primary underline">123-456-7890</a></li>
      <li>Address: 123 Medical Street, Healthcity, HC 54321</li>
    </ul>
  </div>
);

export default Contact;
