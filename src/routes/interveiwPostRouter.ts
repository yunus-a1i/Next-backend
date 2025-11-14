import { Router } from 'express';
import { createPost, deletePost, getAllPosts, getAllPostsFull, getPosts, updatePost } from '../controller/interviewPostController.js';
import { authMiddle } from '../middlewares/authMiddleware.js';

const router: Router = Router();

router.route('/createpost').post(authMiddle, createPost);
router.route('/updatePost/:id').put(authMiddle, updatePost);
router.route('/getPosts/:id').get(authMiddle, getPosts);
router.route('/deletePost/:id').delete(authMiddle, deletePost);
router.route('/getAllPosts').get(getAllPosts);
router.route('/getAllPosts/full').get(getAllPostsFull);

export default router;


