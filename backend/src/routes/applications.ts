import express from "express";
import { submitApplication, getApplications, getApplicationByTracker } from "../controllers/applicationController";

const router = express.Router();

// Create new application
router.post("/", submitApplication);

// List all applications
router.get("/", getApplications);

// Get specific application by tracker number
router.get("/:tracker", getApplicationByTracker);

export default router;
