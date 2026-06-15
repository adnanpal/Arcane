import jwt from "jsonwebtoken";

export const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // legacy usage
    req.user = { userId: decoded.id }; // what routes actually expect!
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      error:
        error.name === "TokenExpiredError"
          ? "Token expired, please login again"
          : "Invalid token",
    });
  }
};
