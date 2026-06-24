import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connections";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import equipmentRoutes from "./routes/equipmentRoutes";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.get("/api/equipments/test", (req, res) => {
  res.json({ message: "hit" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/equipments", equipmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
