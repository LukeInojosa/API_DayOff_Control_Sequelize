import {Router} from 'express';
import { userController } from '../Controllers/index.js';

const router = Router();

router
    .post('', userController.createUser)
    .get('/whoami', userController.getMe)
    .get('{/:username}', userController.getAllUsers)
    .delete('', userController.deleteUser)
    .put('/:username', userController.alterUser)
export default router