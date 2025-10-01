/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  banner: {
    url: string;
    width: number;
    height: number;
  };
  author: User;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
  publishedAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  likesCount: number;
  user: User | null;
  blog: Blog;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type PaginatedResponse<T, K extends string> = {
  limit: number;
  offset: number;
  total: number;
} & {
  [key in K]: T[];
};

export type FieldValidationError = {
  /**
   * Indicates that the error occurred because a field had an invalid value
   */
  type: 'field';
  /**
   * The location within the request where this field is
   */
  location: Location;
  /**
   * The path to the field which has a validation error
   */
  path: string;
  /**
   * The value of the field. It might be unset if the value is hidden.
   */
  value?: string;
  /**
   * The error message
   */
  msg: string;
};

export type ErrorCode =
  | 'BadRequest'
  | 'ValidationError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'NotFound'
  | 'ServerError';

export type ValidationError = {
  code: ErrorCode;
  errors: Record<string, FieldValidationError>;
};

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
};

export interface ActionResponse<T = unknown> {
  ok: boolean;
  err?: ValidationError | ErrorResponse;
  data?: T;
}

export interface AuthResponse {
  accessToken: string;
  user: Pick<User, 'username' | 'email' | 'role'>;
}

export interface BlogCreateResponse {
  blog: Blog;
}
