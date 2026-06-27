import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Reservation from "../models/Reservation";
import Equipment from "../models/Equipment";
import User from "../models/User";
import { ROLES } from "../models/User";

// @desc    Student creates a reservation request
// @route   POST /api/reservations
// @access  Private/Student
export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const {
      equipment,
      quantityRequested,
      borrowDateTime,
      returnDateTime,
      note,
    } = req.body;

    if (
      !equipment ||
      !quantityRequested ||
      !borrowDateTime ||
      !returnDateTime
    ) {
      return res.status(400).json({
        message:
          "Please provide equipment, quantity, borrowDateTime, and returnDateTime",
      });
    }

    // Verify equipment exists and is available
    const equipmentDoc = await Equipment.findById(equipment);
    if (!equipmentDoc) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    if (!equipmentDoc.isAvailable || equipmentDoc.quantity < 1) {
      return res.status(400).json({ message: "Equipment is not available" });
    }
    if (quantityRequested > equipmentDoc.quantity) {
      return res.status(400).json({
        message: `Only ${equipmentDoc.quantity} unit(s) available`,
      });
    }

    // Validate dates
    const borrow = new Date(borrowDateTime);
    const returnD = new Date(returnDateTime);
    if (borrow >= returnD) {
      return res
        .status(400)
        .json({ message: "Return date must be after borrow date" });
    }
    if (borrow < new Date()) {
      return res
        .status(400)
        .json({ message: "Borrow date cannot be in the past" });
    }

    // Student must have an assigned faculty
    const student = await User.findById(req.user?._id).select("faculty_id");
    if (!student?.faculty_id) {
      return res.status(400).json({
        message: "You have no assigned faculty. Contact your administrator.",
      });
    }

    // Equipment must belong to the student's faculty
    if (
      equipmentDoc.createdBy.user.toString() !== student.faculty_id.toString()
    ) {
      return res.status(403).json({
        message: "You can only reserve equipment posted by your faculty",
      });
    }

    const reservation = await Reservation.create({
      type: "equipment",
      student: req.user?._id,
      faculty: student.faculty_id,
      equipment,
      quantityRequested,
      borrowDateTime: borrow,
      returnDateTime: returnD,
      note: note || "",
    });

    const populated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(201).json({ data: populated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Get reservations (role-based)
// @route   GET /api/reservations
// @access  Private
export const getReservations = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    let filter: Record<string, any> = {};

    if (role === ROLES.STUDENT) {
      // Students see only their own reservations
      filter = { student: req.user?._id };
    } else if (role === ROLES.FACULTY) {
      // Faculty sees reservations for equipment they created
      filter = { faculty: req.user?._id };
    }
    // Admin sees all

    const reservations = await Reservation.find(filter)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: reservations });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
export const getReservationById = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Students can only view their own
    if (
      req.user?.role === ROLES.STUDENT &&
      reservation.student._id.toString() !== req.user?._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ data: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Faculty approves a reservation (decrements equipment quantity)
// @route   PATCH /api/reservations/:id/approve
// @access  Private/Faculty
export const approveReservation = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only the assigned faculty can approve
    if (reservation.faculty.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve this reservation" });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: `Cannot approve a reservation with status '${reservation.status}'`,
      });
    }

    // Check equipment still has enough quantity
    const equipment = await Equipment.findById(reservation.equipment);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment no longer exists" });
    }
    if (equipment.quantity < reservation.quantityRequested) {
      return res.status(400).json({
        message: `Not enough stock. Only ${equipment.quantity} unit(s) available`,
      });
    }

    // Decrement quantity
    equipment.quantity -= reservation.quantityRequested;
    await equipment.save(); // pre-save hook auto-updates isAvailable

    reservation.status = "approved";
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Faculty marks reservation as borrowed (student picked up)
// @route   PATCH /api/reservations/:id/borrow
// @access  Private/Faculty
export const borrowReservation = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.faculty.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to mark this reservation as borrowed",
      });
    }

    if (reservation.status !== "approved") {
      return res.status(400).json({
        message: `Cannot mark as borrowed a reservation with status '${reservation.status}'`,
      });
    }

    reservation.status = "borrowed";
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Faculty rejects a reservation
// @route   PATCH /api/reservations/:id/reject
// @access  Private/Faculty
export const rejectReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { rejectedReason } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.faculty.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this reservation" });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: `Cannot reject a reservation with status '${reservation.status}'`,
      });
    }

    reservation.status = "rejected";
    reservation.rejectedReason = rejectedReason || "";
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Faculty marks reservation as returned (increments quantity back)
// @route   PATCH /api/reservations/:id/return
// @access  Private/Faculty
export const returnReservation = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.faculty.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to mark this reservation as returned",
      });
    }

    if (reservation.status !== "borrowed") {
      return res.status(400).json({
        message: `Cannot mark as returned a reservation with status '${reservation.status}'`,
      });
    }

    // Increment quantity back
    const equipment = await Equipment.findById(reservation.equipment);
    if (equipment) {
      equipment.quantity += reservation.quantityRequested;
      await equipment.save(); // pre-save hook auto-updates isAvailable
    }

    reservation.status = "returned";
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Student cancels their own pending reservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Private/Student
export const cancelReservation = async (req: AuthRequest, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.student.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this reservation" });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: `Only pending reservations can be cancelled`,
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate("student", "name email")
      .populate("faculty", "name email")
      .populate("equipment", "name image quantity");

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};
