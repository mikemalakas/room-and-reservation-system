import mongoose, { Document, Model } from "mongoose";

export type ReservationStatus =
  | "pending"
  | "approved"
  | "borrowed"
  | "rejected"
  | "returned"
  | "cancelled";

export type ReservationType = "equipment" | "room";

export interface IReservation extends Document {
  type: ReservationType;
  student: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  // Equipment reservation fields
  equipment?: mongoose.Types.ObjectId;
  quantityRequested: number;
  // Room reservation fields (to be used later)
  room?: mongoose.Types.ObjectId;
  borrowDateTime: Date;
  returnDateTime: Date;
  status: ReservationStatus;
  note: string;
  rejectedReason: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IReservationModel extends Model<IReservation> {}

const reservationSchema = new mongoose.Schema<IReservation, IReservationModel>(
  {
    type: {
      type: String,
      enum: ["equipment", "room"],
      required: [true, "Reservation type is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // --- Equipment fields ---
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      default: null,
    },
    quantityRequested: {
      type: Number,
      min: [1, "Quantity must be at least 1"],
      default: null,
    },
    // --- Room fields (placeholder for later) ---
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    // --- Shared datetime fields ---
    borrowDateTime: {
      type: Date,
      required: [true, "Borrow date and time is required"],
    },
    returnDateTime: {
      type: Date,
      required: [true, "Return date and time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned", "cancelled"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    rejectedReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

// Ensure the right fields are present based on type
reservationSchema.pre("save", function () {
  if (this.type === "equipment") {
    if (!this.equipment)
      throw new Error("equipment is required for equipment reservations");
    if (!this.quantityRequested)
      throw new Error(
        "quantityRequested is required for equipment reservations",
      );
  }
  if (this.type === "room") {
    if (!this.room) throw new Error("room is required for room reservations");
  }
});

const Reservation = mongoose.model<IReservation, IReservationModel>(
  "Reservation",
  reservationSchema,
);

export default Reservation;
