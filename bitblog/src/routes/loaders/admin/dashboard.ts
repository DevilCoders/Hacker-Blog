/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { data, redirect } from 'react-router';

/**
 * Custom modules
 */
import { bitblogApi } from '@/api';

/**
 * Types
 */
import type { LoaderFunction } from 'react-router';
import type { PaginatedResponse, Blog, Comment, User } from '@/types';
import { AxiosError } from 'axios';
export type DashboardData = {
  blogsCount: number;
  commentsCount: number;
  usersCount: number;
  blogs: Blog[];
  comments: Comment[];
  users: User[];
};

const dashboardLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');

  try {
    const blogsResponse = await bitblogApi.get('/blogs', {
      params: { limit: 5 },
    });
    const commentsResponse = await bitblogApi.get('/comments', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 5 },
    });
    const usersResponse = await bitblogApi.get('/users', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 5 },
    });

    const paginatedBlogs = blogsResponse.data as PaginatedResponse<
      Blog,
      'blogs'
    >;
    const paginatedComments = commentsResponse.data as PaginatedResponse<
      Comment,
      'comments'
    >;
    const paginatedUsers = usersResponse.data as PaginatedResponse<
      User,
      'users'
    >;

    return {
      blogsCount: paginatedBlogs.total,
      commentsCount: paginatedComments.total,
      usersCount: paginatedUsers.total,
      blogs: paginatedBlogs.blogs,
      comments: paginatedComments.comments,
      users: paginatedUsers.users,
    } as DashboardData;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw data(err.response?.data.message || err.message, {
        status: err.response?.status || err.status,
        statusText: err.response?.data.code || err.code,
      });
    }

    throw err;
  }
};

export default dashboardLoader;
