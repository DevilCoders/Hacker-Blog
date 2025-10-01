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
import Comment from '@/models/comment';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';
import type { Types } from 'mongoose';
type RequestBody = {
  content: string;
};
type RequestParams = {
  blogId: string;
};

/**
 * @function createComment
 * @description Handles the creation of a comment on a blog post.
 *              Expects `blogId` and `content` in the request body, and `userId` from the authenticated request.
 *
 * @returns {Promise<void>} This function doesn't return a value but sends a response to the client.
 **/
const createComment = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params as RequestParams;
  // Destructure blogId and content from the request body
  const { content } = req.body as RequestBody;

  // Get the authenticated user's ID (set by middleware)
  const userId = req.userId;

  try {
    // Check if the blog post exists by its ID
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    // If the blog doesn't exist, respond with 404 Not Found
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found!',
      });
      return;
    }

    // Create a new comment linked to the blog and the authenticated user
    const newComment = await Comment.create({
      blog: blogId,
      content,
      user: userId,
    });

    logger.info('New comment created', newComment);

    // Increment the blog's comments count and update
    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    // Respond with 201 Created and return the new comment
    res.status(201).json({
      comment: newComment,
    });
  } catch (err) {
    // Handle unexpected errors and respond with 500 Internal Server Error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during comment creation in blog', err);
  }
};

export default createComment;
