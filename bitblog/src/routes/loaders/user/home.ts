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

export interface HomeLoaderResponse {
  recentBlog: PaginatedResponse<Blog, 'blogs'>;
  allBlog: PaginatedResponse<Blog, 'blogs'>;
}

const homeLoader: LoaderFunction = async () => {
  try {
    const { data: recentBlog } = await bitblogApi.get('/blogs', {
      params: { limit: 4 },
    });

    const { data: allBlog } = await bitblogApi.get('/blogs', {
      params: {
        offset: 4,
        limit: 12,
      },
    });

    return { recentBlog, allBlog } as HomeLoaderResponse;
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

export default homeLoader;
