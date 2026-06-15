import express from "express";
import Request from "../models/Request.js";
import User from "../models/User.js";
import { authMiddleWare } from "../middlewares/auth.js";

const router = express.Router();
router.post("/send", authMiddleWare, async (req, res) => {
  try {
    const from = req.user.userId;
    const { to } = req.body;

    if (from === to) {
      return res.status(400).json({ error: "Cannot send to yourself" });
    }

    let existing = await Request.findOne({ from, to });

    if (existing) {
      // allow resend if rejected
      if (existing.status === "rejected") {
        existing.status = "pending";
        await existing.save();
        return res.json(existing);
      }

      return res.status(400).json({ error: "Request already exists" });
    }

    const request = await Request.create({ from, to });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Send failed" });
  }
});

router.post("/respond", authMiddleWare, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.user.userId;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "request not found" });
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    request.status = action;
    await request.save();

    if (action === "accepted") {
      await User.findByIdAndUpdate(request.from, {
        $addToSet: { connections: request.to },
      });

      await User.findByIdAndUpdate(request.to, {
        $addToSet: { connections: request.from },
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
router.post("/cancel", authMiddleWare, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.body;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ✅ Only sender can cancel
    if (request.from.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await request.deleteOne();

    res.json({ message: "Cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});

router.get("/me", authMiddleWare, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching /request/me for userId:", userId);

    const incoming = await Request.find({
      to: userId,
      status: "pending",
    }).populate("from", "username");

    const sent = await Request.find({
      from: userId,
    }).populate("to", "username");

    console.log("Result:", { incoming: incoming.length, sent: sent.length });
    res.json({ incoming, sent });
  } catch (err) {
    console.error("ME ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
