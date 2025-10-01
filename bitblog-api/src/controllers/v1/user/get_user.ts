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

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      user,
    });
    return;
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while getting a user', err);
  }
};

export default getUser;
