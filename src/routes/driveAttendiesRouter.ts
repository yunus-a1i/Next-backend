import { Router } from 'express';
import { CreateDriveAttendies } from '../controller/driveAttendiesController.js';
import { authMiddle } from '../middlewares/authMiddleware.js';

const router: Router = Router();

router.route('/driveAttending').post(authMiddle, CreateDriveAttendies);
export default router;


