const mongoose = require('mongoose');
const BloodBank = require('./models/BloodBank');
require('dotenv').config();

const initialize = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await BloodBank.findOne();
    if (existing) {
      console.log('Blood Bank already exists');
      process.exit(0);
    }

    const bloodBank = await BloodBank.create({
      inventory: [
        { bloodType: "A+", quantity: 0 },
        { bloodType: "A-", quantity: 0 },
        { bloodType: "B+", quantity: 0 },
        { bloodType: "B-", quantity: 0 },
        { bloodType: "AB+", quantity: 0},
        { bloodType: "AB-", quantity: 0},
        { bloodType: "O+", quantity: 0 },
        { bloodType: "O-", quantity: 0 }
      ]
    });

    console.log('Blood Bank initialized:', bloodBank);
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
};

initialize();
