import mongoose, { Document, Model } from "mongoose";

export interface IEquipment extends Document {
  name: string;
  description: string;
  quantity: number;
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
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
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

// Auto-set isAvailable to false when quantity reaches 0
equipmentSchema.pre("save", function () {
  if (this.isModified("quantity")) {
    this.isAvailable = this.quantity > 0;
  }
});

const Equipment = mongoose.model<IEquipment, IEquipmentModel>(
  "Equipment",
  equipmentSchema,
);

export default Equipment;
