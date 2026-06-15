import express from "express";
import { authMiddleWare } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/user/me — return current user's profile
router.get("/me", authMiddleWare, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

// GET /api/user/search?username=xxx — find a user by exact username
router.get("/search", authMiddleWare, async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });

  const user = await User.findOne({ username }).select("_id username");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

export default router;
