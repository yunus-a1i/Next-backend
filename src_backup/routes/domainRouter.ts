import { Router } from 'express';
import { createDomain, deleteDomain, getAllDomain, getDomain, updateDomain } from '../controller/domainController.ts';
import { authMiddle } from '../middlewares/authMiddleware.ts';

const router: Router = Router();

router.route('/createdomain').post(createDomain);
router.route('/getdomain/:id').get(authMiddle,getDomain);
router.route('/getAlldomains').get(authMiddle,getAllDomain);
router.route('/updatedomain/:id').put(authMiddle,updateDomain);
router.route('/deletedomain/:id').delete(authMiddle,deleteDomain);

export default router;
