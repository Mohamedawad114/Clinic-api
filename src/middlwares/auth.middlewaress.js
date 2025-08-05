import jwt from "jsonwebtoken";
const key = process.env.SECRET_KEY;
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) return res.status(401).json({ message: `No token provided` });
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const validateIsAdmin = (req, res, next) => {
  if (req.user?.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ message: `You're not authorized (admin only)` });
};
export default verifyToken;
