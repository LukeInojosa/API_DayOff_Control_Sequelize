import {Router} from 'express';
import { userController } from '../Controllers/index.js';

const router = Router();

router
    .post('/user', userController.createUser)
    .get('/user{/:username}', userController.getAllUsers)
    .delete('/user', userController.deleteUser)
    .put('/user/:username', userController.alterUser)
export default router