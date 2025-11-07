import { Router } from 'express';
import { createPost, deletePost, getAllPosts, getPosts, updatePost } from '../controller/interviewPostController.ts';
import { authMiddle } from '../middlewares/authMiddleware.ts';

const router: Router = Router();

router.route('/createpost').post(authMiddle, createPost);
router.route('/updatepost/:id').put(authMiddle, updatePost);
router.route('/getposts/:id').get(authMiddle, getPosts);
router.route('/deletepost/:id').delete(authMiddle, deletePost);
router.route('/getAllPosts').get(getAllPosts);

export default router;
