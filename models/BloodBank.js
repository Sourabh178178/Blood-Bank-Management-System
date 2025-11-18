const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const bloodBankSchema = new mongoose.Schema({
  inventory: [inventorySchema]
}, { timestamps: true });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
