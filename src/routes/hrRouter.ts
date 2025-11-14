import { Router } from 'express';
import { login, logout } from '../auth/auth.js';
import { authMiddle } from '../middlewares/authMiddleware.js';
import { createHr, deleteHr, getAllAttendeesByHr, getAllPostsByHr, getHr, updateHr } from '../controller/hrController.js';

const router: Router = Router();

router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/createHr').post(createHr);
router.route('/getHr/:id').get(authMiddle, getHr);
router.route('/updateHr/:id').put(authMiddle, updateHr);
router.route('/deleteHr/:id').delete(authMiddle, deleteHr);
router.route('/getAllPostsByHr/:id/posts').get(getAllPostsByHr);
router.route('/:id/attendees').get(getAllAttendeesByHr);

export default router;


