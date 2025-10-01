/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Model
 */
import Like from '@/models/like';
import Blog from '@/models/blog';

/**
 * Type
 */
import { Request, Response } from 'express';

/**
 * @function unlikeBlog
 * @description Handles unlike blog-post by decrementing its likes count.
 *              Expects `blogId` in the request parameters.
 *
 * @param {Request} req - Express request object containing the blogId in the route params.
 * @param {Response} res - Express response object used to send the result.
 *
 * @returns {Promise<void>} Responds with a success message or appropriate error.
 */
const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
  // Extract the current userId form request body
  const { userId } = req.body;

  // Extract the blogId
  const { blogId } = req.params;

  try {
    // Check if the like entry exists for the current user and blog
    const existingLike = await Like.findOne({ userId, blogId }).lean().exec();

    if (!existingLike) {
      // If no like found, respond with 400 Bad Request
      res.status(400).json({
        code: 'BadRequest',
        message: 'Like not found',
      });
      return;
    }

    // Remove the like entry from the database
    await Like.deleteOne({ _id: existingLike._id });

    // Retrieve the blog to update its like count
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      // If the blog doesn't exist, respond with 404 Not Found
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Decrease the blog's like count by one
    blog.likesCount--;
    await blog.save();

    logger.info('Blog unliked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    // Send 204 No Content to indicate successful unlike with no response body
    res.sendStatus(204);
  } catch (err) {
    // Handler server level error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while unliking blog', err);
  }
};

export default unlikeBlog;
