const jwt = require('jsonwebtoken');

// Generate JWT with optional audience (role)
const generateToken = (id, role) => {
  const payload = { id, role };
  const options = {
    expiresIn: '30d',
    issuer: 'blood-bank-api',
  };

  // Only add audience if role is a non-empty string
  if (role && typeof role === 'string') {
    options.audience = role;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Verify JWT (optionally check audience if needed)
const verifyToken = (token, role) => {
  const options = {
    issuer: 'blood-bank-api',
  };
  // Only check audience if role is provided
  if (role && typeof role === 'string') {
    options.audience = role;
  }
  return jwt.verify(token, process.env.JWT_SECRET, options);
};

module.exports = { generateToken, verifyToken };
