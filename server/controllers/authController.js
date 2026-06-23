import User, { ROLES } from "../models/User.js";
import Roles from "../models/Roles.js";
import generateToken from "../utils/generateToken.js";

const ROLE_NAMES = Object.fromEntries(
  Object.entries(ROLES).map(([name, id]) => [id, name]),
);

// @desc    Register a new user (public signup — always 'student' role)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "A user with that email already exists" });
    }

    // role is intentionally NOT taken from req.body — public signup is always 'student'
    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.student,
    });

    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // password has select:false on the schema, so explicitly include it here
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: ROLE_NAMES[user.role].toLowerCase(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Logout user (clears the cookie)
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  // req.user is already attached by the protect middleware
  res.json(req.user);
};

// @desc    Admin creates a user with any role (admin/faculty/student)
// @route   POST /api/auth/admin/create-user
// @access  Private/Admin
export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, password, and role" });
    }

    if (!["admin", "faculty", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "A user with that email already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
