/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Model
 */
import Comment from '@/models/comment';

/**
 * Types
 */
import type { Request, Response } from 'express';
type RequestQuery = {
  offset: string;
  limit: string;
};

const getComments = async (req: Request, res: Response): Promise<void> => {
  const { offset = config.defaultResOffset, limit = config.defaultResLimit } =
    req.query as RequestQuery;

  try {
    const comments = await Comment.find()
      .populate('blog', 'banner.url title slug')
      .populate('user', 'username email firstName lastName')
      .limit(Number(limit))
      .skip(Number(offset))
      .lean()
      .exec();
    const total = await Comment.countDocuments();

    res.status(200).json({
      offset: Number(offset),
      limit: Number(limit),
      total,
      comments,
    });
  } catch (err) {
    // Handle unexpected error and respond with 500 Server Error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error retrieving comments', err);
  }
};

export default getComments;
