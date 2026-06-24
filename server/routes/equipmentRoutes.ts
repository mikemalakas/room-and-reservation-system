import { Router } from "express";
import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../controllers/equipmentController";
import { protect, authorize } from "../middleware/authMiddleware";
import { upload } from "../utils/cloudinary";
import { ROLES } from "../models/User";

const router = Router();

router.get("/", protect, getEquipment);
router.get("/:id", protect, getEquipmentById);
router.post(
  "/",
  protect,
  upload.single("image"),
  authorize(ROLES.ADMIN, ROLES.FACULTY),
  createEquipment,
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  authorize(ROLES.ADMIN, ROLES.FACULTY),
  updateEquipment,
);
router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.FACULTY),
  deleteEquipment,
);

export default router;
