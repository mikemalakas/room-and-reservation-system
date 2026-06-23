import jwt from "jsonwebtoken";

// Creates a JWT and sets it as an httpOnly cookie on the response
const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // not accessible via JS in the browser, protects against XSS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

export default generateToken;
