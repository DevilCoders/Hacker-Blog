/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const newToken = await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info('Refresh token created for user', newToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User logged in successfully', user);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during user login', err);
  }
};

export default login;
