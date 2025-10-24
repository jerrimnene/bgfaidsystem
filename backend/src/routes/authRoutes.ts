import express from "express";
import { login } from "../controllers/authController";

const router = express.Router();

// Only login route for now (others removed to match working controller)
router.post("/login", login);

export default router;
