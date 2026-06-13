import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";


const router = Router();
router.post("/signup", authController.signupUser);
router.post("/signin", authController.signinUser)

export const authRoute = router;