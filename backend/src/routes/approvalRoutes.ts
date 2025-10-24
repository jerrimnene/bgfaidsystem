import express from "express";
import { updateApproval, getApprovalsByAssignee } from "../models/Approval";

const router = express.Router();

// Get all approvals assigned to a user
router.get("/:assigned_to", async (req, res) => {
  try {
    const { assigned_to } = req.params;
    const data = await getApprovalsByAssignee(assigned_to);
    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update approval decision
router.put("/", async (req, res) => {
  try {
    const { application_id, assigned_to, status, review_notes } = req.body;
    if (!application_id || !assigned_to || !status)
      return res.status(400).json({ success: false, error: "Missing required fields" });

    const updated = await updateApproval(application_id, assigned_to, status, review_notes);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
