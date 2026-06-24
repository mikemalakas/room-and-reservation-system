import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = {
  ADMIN: 1,
  FACULTY: 2,
  STUDENT: 3,
} as const;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: number;
  faculty_id?: mongoose.Types.ObjectId | null;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: Number,
      enum: [1, 2, 3],
      default: 3,
      required: true,
    },
    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: async function (facultyId: mongoose.Types.ObjectId) {
          if (!facultyId) return true;
          const faculty = await mongoose.model("User").findById(facultyId);
          return faculty && faculty.role === ROLES.FACULTY;
        },
        message:
          "faculty_id must reference a valid user with the faculty role (2)",
      },
    },
  },
  { timestamps: true },
);

// Hash password before saving — Mongoose 9+: no next() callback
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
