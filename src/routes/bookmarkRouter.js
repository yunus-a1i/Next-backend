// src/routes/bookmarkRoutes.js
import { Router } from 'express';
import { addBookmark, removeBookmark, getUserBookmarks } from '../controller/bookmarkController.js';
import { authMiddle } from '../middlewares/authMiddleware.js';

const router = Router();

// Protected routes
router.post('/', authMiddle, addBookmark); // body: { interveiwPostId }
router.delete('/:id', authMiddle, removeBookmark); // param id =  doc id
router.delete('/', authMiddle, removeBookmark); // query ?postId=...
router.get('/bookmarks', authMiddle, getUserBookmarks); // ?limit=&page=

export default router;
