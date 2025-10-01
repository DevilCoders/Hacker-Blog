/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { data } from 'react-router';

/**
 * Custom modules
 */
import { bitblogApi } from '@/api';

/**
 * Types
 */
import type { LoaderFunction } from 'react-router';
import type { Blog, PaginatedResponse } from '@/types';
import { AxiosError } from 'axios';

const userBlogLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  try {
    const response = await bitblogApi.get('/blogs', {
      params: Object.fromEntries(url.searchParams),
    });
    const data = response.data as PaginatedResponse<Blog, 'blogs'>;

    return data;
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

export default userBlogLoader;
