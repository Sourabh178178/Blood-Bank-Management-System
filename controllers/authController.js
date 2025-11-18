const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const { generateToken } = require("../utils/generateToken");

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required: name, email, password");
  }
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: "admin"
  });
  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// Login User (Donor, Hospital, Admin)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    res.status(400);
    throw new Error("Email, password, and role are required");
  }
  const normalizedRole = role.toLowerCase();
  const user = await User.findOne({ email, role: normalizedRole });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  let profile = null;
  if (user.role === "donor") {
    profile = await Donor.findOne({ user: user._id });
  } else if (user.role === "hospital") {
    profile = await Hospital.findOne({ user: user._id });
  }
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
    profile,
  });
});

// Register Donor
const registerDonor = asyncHandler(async (req, res) => {
  const { name, email, password, age, bloodType, address, sex,phone } = req.body;
  if (!name || !email || !password || !age || !bloodType || !address || !sex|| !phone) {
    res.status(400);
    throw new Error(
      "All fields are required: name, email, password, age, bloodType, address, sex, phone "
    );
  }
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: "donor",
  });
  const donor = await Donor.create({
    user: user._id,
    age,
    bloodType,
    address,
    sex,
    phone,
  });
  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
    profile: donor,
  });
});

// Register Hospital
const registerHospital = asyncHandler(async (req, res) => {
  const { name, email, password, hospitalId, address, location, contact } =
    req.body;
  const requiredFields = [
    "name",
    "email",
    "password",
    "hospitalId",
    "address",
    "location",
    "contact",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      res.status(400);
      throw new Error("Email already registered");
    }
    const existingHospital = await Hospital.findOne({ hospitalId }).session(
      session
    );
    if (existingHospital) {
      res.status(400);
      throw new Error("Hospital ID already exists");
    }
    const userArr = await User.create(
      [
        {
          name,
          email,
          password,
          role: "hospital",
        },
      ],
      { session }
    );
    const user = userArr[0];
    const hospitalArr = await Hospital.create(
      [
        {
          user: user._id,
          hospitalId,
          address,
          location,
          contact,
        },
      ],
      { session }
    );
    const hospital = hospitalArr[0];
    await session.commitTransaction();
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
      profile: hospital,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400);
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
});

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  let profile = null;
  if (req.user.role === "donor") {
    profile = await Donor.findOne({ user: req.user._id });
  } else if (req.user.role === "hospital") {
    profile = await Hospital.findOne({ user: req.user._id });
  }
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profile,
  });
});

module.exports = {
  loginUser,
  registerDonor,
  registerHospital,
  getUserProfile,
  registerAdmin,
};
