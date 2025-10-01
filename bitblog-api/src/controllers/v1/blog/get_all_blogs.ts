/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import config from '@/config';
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
interface QueryType {
  status?: 'draft' | 'published';
}

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const query: QueryType = {};
    const user = await User.findById(userId).select('role').lean().exec();

    // Show only the published post to a normal user
    if (!user || user.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .select('-banner.publicId -__v')
      .populate('author', 'firstName lastName username email')
      .limit(limit)
      .skip(offset)
      .sort({ publishedAt: 'desc' })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while fetching blogs', err);
  }
};

export default getAllBlogs;
