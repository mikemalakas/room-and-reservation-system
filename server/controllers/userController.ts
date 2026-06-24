import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User, { ROLES } from "../models/User";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().populate("faculty_id", "name email");
    res.status(200).json({ data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "faculty_id",
      "name email",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, faculty_id } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, password, and role" });
    }

    if (![ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "A user with that email already exists" });
    }

    if (role === ROLES.STUDENT && !faculty_id) {
      return res
        .status(400)
        .json({ message: "Students must be assigned a faculty member" });
    }

    if (role !== ROLES.STUDENT && faculty_id) {
      return res
        .status(400)
        .json({ message: "faculty_id is only applicable for students" });
    }

    const user = await User.create({ name, email, password, role, faculty_id });
    const populated = await User.findById(user._id).populate(
      "faculty_id",
      "name email",
    );

    res.status(201).json({ data: populated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, faculty_id } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role && ![ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // pre-save hook will hash it
    if (role !== undefined) user.role = role;
    if ("faculty_id" in req.body) user.faculty_id = faculty_id ?? null;

    await user.save();

    const updated = await User.findById(user._id).populate(
      "faculty_id",
      "name email",
    );
    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};
