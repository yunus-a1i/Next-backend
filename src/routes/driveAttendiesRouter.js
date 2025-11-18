import { Router } from 'express';
import { authMiddle } from '../middlewares/authMiddleware.js';
import { createDriveAttendies } from '../controller/driveAttendiesController.js';

const router = Router();

router.route('/driveAttending').post(authMiddle, createDriveAttendies);
export default router;
