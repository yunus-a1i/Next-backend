import { Router } from 'express';
import { CreateDriveAttendies } from '../controller/driveAttendiesController.ts';
import { authMiddle } from '../middlewares/authMiddleware.ts';

const router: Router = Router();

router.route('/driveAttending').post(authMiddle, CreateDriveAttendies);
export default router;
