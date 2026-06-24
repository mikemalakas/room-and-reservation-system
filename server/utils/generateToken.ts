import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Creates a JWT and sets it as an httpOnly cookie on the response
const generateToken = (
  res: Response,
  userId: mongoose.Types.ObjectId,
  role: number,
): void => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign({ userId, role }, secret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
