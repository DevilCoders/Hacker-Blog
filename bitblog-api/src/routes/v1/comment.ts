/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';
import { body, param } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

/**
 * Controllers
 */
import createComment from '@/controllers/v1/comment/comment_blog';
import getCommentsByBlog from '@/controllers/v1/comment/get_comments_by_blog';
import deleteComment from '@/controllers/v1/comment/delete_comment';
import getComments from '@/controllers/v1/comment/get_comments';

const router = Router();

router.post(
  '/blog/:blogId', // Route to comment a blog
  authenticate, // Middleware to verify if the user is authenticated
  authorize(['admin', 'user']), // Middleware to check if the user has the required role
  param('blogId')
    .notEmpty()
    .withMessage('Blog id is required')
    .isMongoId()
    .withMessage('Invalid blog id'),
  body('content').notEmpty().withMessage('Content is required'),
  validationError,
  createComment, // Controller function that handles the "comment" logic
);

router.get('/', authenticate, authorize(['admin']), getComments);

router.get(
  '/blog/:slug', // Route to get all comments associate with the specific blog post
  getCommentsByBlog, // Controller function that handles the "get comment" logic
);

router.delete(
  '/:commentId', // Route to delete a comment
  authenticate, // Middleware to verify if the user is authenticated
  authorize(['admin', 'user']), // Middleware to check if the user has the required role
  deleteComment, // Controller function that handles the "comment delete" logic
);

export default router;
