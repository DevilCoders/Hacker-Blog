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

const adminLoader: LoaderFunction = async () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');

  try {
    const { data } = await bitblogApi.get('/users/current', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (data.user.role !== 'admin') return redirect('/');
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

export default adminLoader;
