// src/routes/userRoutes.js
import { Router } from 'express';
import { createUser, deleteUser, getUser, updateUser } from '../controller/userController.js';
import { login, logout } from '../auth/auth.js';
import { authMiddle } from '../middlewares/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/logout', logout);

// User routes
router.post('/createUser', createUser);
router.get('/getUser/:id', authMiddle, getUser);
router.put('/updateUser/:id', authMiddle, updateUser);
router.delete('/deleteUser/:id', authMiddle, deleteUser);

export default router;
