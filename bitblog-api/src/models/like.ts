/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

// Interface representing the structure of a like document
interface ILike {
  // ID of the blog post that was liked
  blogId?: Types.ObjectId;

  // ID of the user who liked the blog or comment
  userId: Types.ObjectId;

  // ID of the comment that was liked
  commentId?: Types.ObjectId;
}

// Mongoose schema for storing likes information
const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<ILike>('Like', likeSchema);
