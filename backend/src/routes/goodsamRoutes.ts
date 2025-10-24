import express from "express";
import { createGoodSam, getGoodSamList } from "../controllers/goodsamController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Create new GoodSam record
router.post("/", verifyToken, createGoodSam);

// Get all GoodSam records
router.get("/", getGoodSamList);

export default router;
