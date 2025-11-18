const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "User reference is required"] 
  },
  hospitalId: { 
    type: String, 
    required: [true, "Hospital ID is required"], 
    unique: true 
  },
  address: { 
    type: String, 
    required: [true, "Address is required"] 
  },
  location: { 
    type: String, 
    required: [true, "Location is required"] 
  },
  contact: { 
    type: String, 
    required: [true, "Contact number is required"] 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Hospital', hospitalSchema);
