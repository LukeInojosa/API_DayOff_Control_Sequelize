import { Router } from "express";
import { dayOffController } from "../Controllers/index.js";

const router = Router()

router
    .get('{/:status}', dayOffController.getDayOffs)
    .post('', dayOffController.createDayOff)
    .delete('', dayOffController.deleteDayOff)
    .patch('', dayOffController.patchDayOff)

export default router