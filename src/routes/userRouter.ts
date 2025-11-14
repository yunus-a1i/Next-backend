import { Router } from 'express';
import { createUser, deleteUser, getUser, updateUser } from '../controller/userController.js';
import { login, logout } from '../auth/auth.js';
import { authMiddle } from '../middlewares/authMiddleware.js';

const router: Router = Router();

router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/createUser').post(createUser);
router.route('/getUser/:id').get(authMiddle, getUser);
router.route('/updateUser/:id').put(authMiddle, updateUser);
router.route('/deleteUser/:id').delete(authMiddle, deleteUser);

export default router;


