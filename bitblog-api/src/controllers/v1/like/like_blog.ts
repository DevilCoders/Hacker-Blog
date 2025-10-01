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
import Blog from '@/models/blog';
import Like from '@/models/like';

/**
 * Types
 */
import type { Request, Response } from 'express';

/**
 * @function likeBlog
 * @description Increments the like count of a blog post by its ID.
 *
 * @param {Request} req - Express request object containing the blog ID in `req.params`.
 * @param {Response} res - Express response object used to send the response.
 *
 * @returns {Promise<void>} Responds with 404 if the blog is not found,
 *                          or 500 if a server error occurs.
 *                          Increments and saves the like count on success.
 **/
const likeBlog = async (req: Request, res: Response) => {
  // Extract blogId from the route parameters
  const { blogId } = req.params;

  // Extract userId from the request body
  const userId = req.userId;

  try {
    // Find the blog by ID and select only the likesCount field
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    // If the blog doesn't exist, return a 404 Not Found response
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not Found',
      });
      return;
    }

    /**
     * Queries the database to check whether the current user
     * has already liked the given blog post to prevent duplicate likes.
     */
    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You already liked this blog',
      });
      return;
    }

    // Create a new like entry for the specified blog by the user
    await Like.create({ blogId, userId });

    // Increment the blog's likes count by 1
    blog.likesCount++;

    // Save the updated blog document to the database
    await blog.save();

    logger.info('Blog liked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    /**
     * Sends a 200 OK response indicating the blog was liked successfully.
     * Includes the updated number of likes in the response payload.
     */
    res.status(200).json({
      likesCount: blog.likesCount,
    });
  } catch (err) {
    // Handle unexpected server errors
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while liking blog', err);
  }
};

export default likeBlog;
