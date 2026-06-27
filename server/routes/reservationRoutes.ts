import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  approveReservation,
  borrowReservation,
  rejectReservation,
  returnReservation,
  cancelReservation,
} from "../controllers/reservationController";
import { protect, authorize } from "../middleware/authMiddleware";
import { ROLES } from "../models/User";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student creates a reservation
router.post("/", authorize(ROLES.STUDENT), createReservation);

// Get all reservations (filtered by role inside controller)
router.get("/", getReservations);

// Get single reservation
router.get("/:id", getReservationById);

// Faculty actions
router.patch("/:id/approve", authorize(ROLES.FACULTY), approveReservation);
router.patch("/:id/borrow", authorize(ROLES.FACULTY), borrowReservation);
router.patch("/:id/reject", authorize(ROLES.FACULTY), rejectReservation);
router.patch("/:id/return", authorize(ROLES.FACULTY), returnReservation);

// Student cancels
router.patch("/:id/cancel", authorize(ROLES.STUDENT), cancelReservation);

export default router;
