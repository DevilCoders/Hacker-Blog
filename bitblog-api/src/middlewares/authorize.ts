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
import type { Request, Response, NextFunction } from 'express';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
        return;
      }

      return next();
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err,
      });

      logger.error('Error while authorizing user', err);
    }
  };
};

export default authorize;
