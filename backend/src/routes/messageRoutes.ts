import express from "express";
import { createMessage, getMessages } from "../models/Message";

const router = express.Router();

// Get chat messages for one application
router.get("/:id", async (req, res) => {
  try {
    const msgs = await getMessages(parseInt(req.params.id));
    res.json({ success: true, data: msgs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Post a new message
router.post("/", async (req, res) => {
  try {
    const msg = await createMessage(req.body);
    res.json({ success: true, data: msg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
