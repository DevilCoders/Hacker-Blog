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
import { AxiosError } from 'axios';

const allCommentLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');

  try {
    const { data } = await bitblogApi.get('/comments', {
      params: Object.fromEntries(url.searchParams.entries()),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

export default allCommentLoader;
