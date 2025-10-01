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
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while getting all users', err);
  }
};

export default getAllUser;
