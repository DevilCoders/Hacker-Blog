/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import * as express from 'express';

/**
 * Types
 */
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
