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
import Comment from '@/models/comment';
import User from '@/models/user';
import Blog from '@/models/blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  // Retrieve current userId from the request object
  const currentUserId = req.userId;

  // Extract commentId from request object
  const { commentId } = req.params;

  try {
    // Find the comment by ID and select only userID field
    const comment = await Comment.findById(commentId)
      .select('user blog')
      .exec();

    // Retrieve the current user's role from the database using their ID
    const user = await User.findById(currentUserId).select('role').exec();

    // Respond 404 NotFound if comment doesn't exist
    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found!',
      });
      return;
    }

    // Check if the current user is neither the owner of the comment nor an admin
    if (comment.user !== currentUserId && user?.role !== 'admin') {
      // If not authorized, respond with 403 Forbidden
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied insufficient permission',
      });

      logger.warn('A user tried to delete a comment without permission', {
        userId: currentUserId,
        comment,
      });
      return;
    }

    // Delete the comment by it's ID
    await comment.deleteOne({ _id: commentId });

    logger.info('Comment deleted successfully', {
      commentId,
    });

    // Find the blog its id and select commentsCount field
    const blog = await Blog.findById(comment.blog)
      .select('commentsCount')
      .exec();

    // Respond 404 not found if blog doesn't exist
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Decrement the commentsCount and update the blog to the database
    blog.commentsCount--;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    // Sends 204 successful status
    res.sendStatus(204);
    return;
  } catch (err) {
    // Handle unexpected server error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting comment', err);
  }
};

export default deleteComment;
