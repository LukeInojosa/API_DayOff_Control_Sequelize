import { Router } from "express";
import { authController } from "../Controllers/index.js";
const router = Router()

router
    .post('/signIn', authController.signIn)
    .post('/signUp', authController.signUp)
export default router