/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from 'express';
import { body, query, param } from 'express-validator';
import multer from 'multer';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';

/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/create_blog';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug';
import updateBlog from '@/controllers/v1/blog/update_blog';
import deleteBlog from '@/controllers/v1/blog/delete_blog';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadBlogBanner('post'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  createBlog,
);

router.get(
  '/',
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Page must be a positive integer'),
  validationError,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Page must be a positive integer'),
  validationError,
  getBlogsByUser,
);

router.get(
  '/:slug',
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

router.put(
  '/:slug',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadBlogBanner('put'),
  body('title')
    .optional()
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  updateBlog,
);

router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);

export default router;
