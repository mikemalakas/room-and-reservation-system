import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }, // 'student', 'faculty', 'admin'
});

export default mongoose.model("Roles", roleSchema);
