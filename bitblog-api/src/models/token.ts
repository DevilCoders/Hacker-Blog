/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

export default model<IToken>('Token', tokenSchema);
