import express from "express";
import { getUploads } from "../controllers/uploadController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Simple route for viewing uploaded records
router.get("/", verifyToken, getUploads);

export default router;
