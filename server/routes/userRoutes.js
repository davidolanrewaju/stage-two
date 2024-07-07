import express from "express";
import { getUserById } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/:id', authMiddleware, getUserById);

export default router;
