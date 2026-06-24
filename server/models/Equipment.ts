import mongoose, { Document, Model } from "mongoose";

export interface IEquipment extends Document {
  name: string;
  description: string;
  isAvailable: boolean;
  image: {
    url: string;
    publicId: string;
  };
  createdBy: {
    user: mongoose.Types.ObjectId;
    role: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IEquipmentModel extends Model<IEquipment> {}

const equipmentSchema = new mongoose.Schema<IEquipment, IEquipmentModel>(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Image public ID is required"],
      },
    },
    createdBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const Equipment = mongoose.model<IEquipment, IEquipmentModel>(
  "Equipment",
  equipmentSchema,
);

export default Equipment;
