/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, banner, status } = req.body as BlogData;

    const userId = req.userId;
    const slug = req.params.slug;

    const user = await User.findById(userId).select('role').exec();
    const blog = await Blog.findOne({ slug }).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to update a blog without permission', {
        userId,
        blog,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();
    logger.info('Blog updated', {
      blog,
    });

    res.status(200).json({
      blog,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while updating blog', err);
  }
};

export default updateBlog;
