const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  bloodType: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['donation', 'distribution'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
