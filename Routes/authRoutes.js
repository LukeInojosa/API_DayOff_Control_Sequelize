import { Router } from "express";
import { authController } from "../Controllers/index.js";
const router = Router()

router
    .post('/auth', authController.autenticate)

export default router