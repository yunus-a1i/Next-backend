import { Router } from 'express';
import { createUser, deleteUser, getUser, updateUser } from '../controller/userController.ts';
import { login, logout } from '../auth/auth.ts';
import { authMiddle } from '../middlewares/authMiddleware.ts';

const router: Router = Router();

router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/createUser').post(createUser);
router.route('/getUser/:id').get(authMiddle, getUser);
router.route('/updateUser/:id').put(authMiddle, updateUser);
router.route('/deleteUser/:id').delete(authMiddle, deleteUser);

export default router;
