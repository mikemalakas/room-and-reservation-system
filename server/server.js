import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connections.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default dev port
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
