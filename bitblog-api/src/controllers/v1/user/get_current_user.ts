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
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-__v').exec();

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while getting current user', err);
  }
};

export default getCurrentUser;
