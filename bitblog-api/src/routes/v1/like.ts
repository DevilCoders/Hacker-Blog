/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';

/**
 * Controllers
 */
import likeBlog from '@/controllers/v1/like/like_blog';
import unlikeBlog from '@/controllers/v1/like/unlike_blog';

/**
 * Router initial
 */
const router = Router();

router.post(
  '/blog/:blogId', // Route to like a blog
  authenticate, // Middleware to verify if the user is authenticated
  authorize(['admin', 'user']), // Middleware to check if the user has the required role
  likeBlog, // Controller function that handles the "like" logic
);

router.delete(
  '/blog/:blogId', // Router to unlike a blog post
  authenticate, // Middleware to verify if the user is authenticated
  authorize(['admin', 'user']), // Middleware to check if the user has the required role
  unlikeBlog, // Controller function that handles the "like" logic
);

// router.post('/comment/:commentId', authenticate, authorize(['admin', 'user']), likeComment);

export default router;
