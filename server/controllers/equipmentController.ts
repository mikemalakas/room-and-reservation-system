import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Equipment from "../models/Equipment";
import cloudinary from "../utils/cloudinary";
import { ROLES } from "../models/User";

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
export const getEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;

    let filter: Record<string, any> = {};

    if (role === ROLES.FACULTY) {
      filter = { "createdBy.user": req.user?._id };
    } else if (role === ROLES.STUDENT) {
      if (!req.user?.faculty_id) {
        return res.status(200).json({ data: [] });
      }

      filter = {
        isAvailable: true,
        "createdBy.user": req.user?.faculty_id,
      };
    }

    // then after the query runs:
    const equipment = await Equipment.find(filter)
      .populate("createdBy.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: equipment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Private
export const getEquipmentById = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      "createdBy.user",
      "name email",
    );
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(200).json({ data: equipment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private/Admin/Faculty
export const createEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Please provide name and description" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const equipment = await Equipment.create({
      name,
      description,
      image: {
        url: (req.file as any).path,
        publicId: (req.file as any).filename,
      },
      createdBy: {
        user: req.user?._id,
        role: req.user?.role,
      },
    });

    const populated = await Equipment.findById(equipment._id).populate(
      "createdBy.user",
      "name email",
    );

    res.status(201).json({ data: populated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin/Faculty
export const updateEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // only the creator or an admin can update
    const isAdmin = req.user?.role === 1;
    const isCreator =
      equipment.createdBy.user.toString() === req.user?._id.toString();

    if (!isAdmin && !isCreator) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this equipment" });
    }

    const { name, description, isAvailable } = req.body;

    if (name) equipment.name = name;
    if (description) equipment.description = description;
    if (isAvailable !== undefined)
      equipment.isAvailable = isAvailable === "true" || isAvailable === true;

    // if new image uploaded, delete old one from cloudinary and replace
    if (req.file) {
      await cloudinary.uploader.destroy(equipment.image.publicId);
      equipment.image = {
        url: (req.file as any).path,
        publicId: (req.file as any).filename,
      };
    }

    await equipment.save();

    const updated = await Equipment.findById(equipment._id).populate(
      "createdBy.user",
      "name email",
    );

    res.status(200).json({ data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin/Faculty
export const deleteEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // only the creator or an admin can delete
    const isAdmin = req.user?.role === 1;
    const isCreator =
      equipment.createdBy.user.toString() === req.user?._id.toString();

    if (!isAdmin && !isCreator) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this equipment" });
    }

    await cloudinary.uploader.destroy(equipment.image.publicId);
    await equipment.deleteOne();

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: (err as Error).message });
  }
};
