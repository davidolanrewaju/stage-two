import express from "express";
import {
  createOrganisation,
  getAllOrganisation,
  getOranisationById,
  addUserToOrganisation,
} from "../controller/organisationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', authMiddleware, createOrganisation);
router.get('/', authMiddleware, getAllOrganisation);
router.get('/:orgId', authMiddleware, getOranisationById);
router.post('/:orgId/users', authMiddleware, addUserToOrganisation);

export default router;
