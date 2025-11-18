// src/routes/adminRoutes.js
import { Router } from 'express';
import { createAdmin, getAdminProfile, loginAdmin, logoutAdmin } from '../controller/adminController.js';
import { adminAuth } from '../auth/adminAuth.js';

const router = Router();

// Public
router.post('/create', createAdmin);
router.post('/login', loginAdmin);

// Protected
router.post('/logout', adminAuth, logoutAdmin);
router.get('/me', adminAuth, getAdminProfile);

export default router;
