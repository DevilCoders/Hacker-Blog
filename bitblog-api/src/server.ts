/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Custom modules
 */
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger, logtail } from '@/lib/winston';
import limiter from '@/lib/express_rate_limit';
import config from '@/config';
import httpLogger from '@/middlewares/httpLogger';

/**
 * Router
 */
import v1Routes from '@/routes/v1';

/**
 * Express app initial
 */
const app = express();

// Enable HTTP request logging in production
if (config.NODE_ENV === 'production') {
  app.use(httpLogger);
}

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow all origins in development mode
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  }),
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 *
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (`/api/v1`).
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1.
 */
(async () => {
  try {
    await connectToDatabase();

    app.use('/v1', v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server running: http://localhost:${config.PORT}`);
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start the server`, err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 *
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a successful shutdown).
 */
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    await logtail.flush(); // Ensure all logs are sent before exiting
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown', err);
  }
};

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 *
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`).
 * - When either signal is received, `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
