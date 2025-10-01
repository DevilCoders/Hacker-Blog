/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';

const skipRoutes = ['/api/v1'];

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  if (skipRoutes.includes(req.path)) {
    return next();
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, statusCode } = req;

    // Skip static assets like images, CSS, and JS files
    if (req.path.match(/\.(jpg|jpeg|png|gif|svg|ico|woff2|css|js)$/)) return;

    logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, {
      method,
      url: originalUrl,
      statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      protocol: req.protocol,
      hostname: req.hostname,
    });
  });

  next();
};

export default httpLogger;
