import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "multer";
import User, { IUser } from "../models/User";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
  file?: Express.Multer.File;
}

// Verifies the JWT cookie and attaches the user to req.user
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user =
      (await User.findById(decoded.userId).select("-password")) ?? undefined;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Restricts access to specific roles, e.g. authorize(ROLES.ADMIN, ROLES.FACULTY)
export const authorize = (...roles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user?.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
