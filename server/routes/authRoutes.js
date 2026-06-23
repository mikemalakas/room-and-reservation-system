import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  adminCreateUser,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

// Only admins can hit this to create faculty/admin/student accounts directly
router.post("/admin/create-user", protect, authorize("admin"), adminCreateUser);

export default router;
