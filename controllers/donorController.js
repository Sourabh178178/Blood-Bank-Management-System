exports.updateDonorProfile = asyncHandler(async (req, res) => {
  const donor = await Donor.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);

  if (!donor || !user) {
    res.status(404);
    throw new Error('Donor not found');
  }

  // Update User model (name, email)
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  await user.save();

  // Update Donor model (phone, address, dob)
  donor.phone = req.body.phone; // Remove fallback to existing value
  donor.address = req.body.address;
  donor.dob = req.body.dob;
  await donor.save();

  res.json({
    name: user.name,
    email: user.email,
    bloodType: donor.bloodType,
    phone: donor.phone, // Now guaranteed to return updated value
    address: donor.address,
    dob: donor.dob
  });
});
