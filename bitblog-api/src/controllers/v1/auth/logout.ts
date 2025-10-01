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
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import config from '@/config';

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        refreshToken,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(204);

    logger.info('User logged out successfully', {
      userId: req.userId,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during logout', err);
  }
};

export default logout;
