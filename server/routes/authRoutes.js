import express from "express";
import { userRegistration, userLogin } from "../controller/authController.js";
import { loginValidationRules, registerValidationRules, validateMiddleware } from "../middleware/validation.js";

const router = express.Router();

router.post('/register', registerValidationRules(), validateMiddleware, userRegistration);
router.post('/login', loginValidationRules(), validateMiddleware, userLogin);

export default router;

