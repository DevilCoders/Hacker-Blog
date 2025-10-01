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
import Blog from '@/models/blog';
import Comment from '@/models/comment';

/**
 * Types
 */
import type { Request, Response } from 'express';

/**
 * @function getCommentsByBlog
 * @description Retrieve all comments associate with the specific blog post
 * @returns {Promise<void>} Responds with list of comments or and appropriate error message
 */
const getCommentsByBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Destructure blogId from the request params
  const { slug } = req.params;

  try {
    // Check if the blog post exist by its ID
    const blog = await Blog.findOne({ slug }).select('_id').exec();

    // If the blog doesn't exist, respond with 404 not fount
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found!',
      });
      return;
    }

    // Find the all comments where blog ID matches
    const allComments = await Comment.find({ blog: blog._id })
      .populate('blog', 'banner.url title slug')
      .populate('user', 'username firstName lastName')
      .lean()
      .exec();

    // Responds 201 OK and the list of the comments
    res.status(201).json({
      comments: allComments,
    });
  } catch (err) {
    // Handle unexpected error and respond with 500 Server Error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error retrieving comments', err);
  }
};

export default getCommentsByBlog;
