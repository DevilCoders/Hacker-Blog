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

const refreshTokenLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get('redirect') ?? '/';

  try {
    const { data } = await bitblogApi.post(
      '/auth/refresh-token',
      {},
      { withCredentials: true },
    );

    localStorage.setItem('accessToken', data.accessToken);

    return redirect(redirectUri);
  } catch (err) {
    if (err instanceof AxiosError) {
      const tokenExpired = err.response?.data.message.includes('token expired');

      if (tokenExpired) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        return redirect('/login');
      }

      throw data(err.response?.data.message || err.message, {
        status: err.response?.status || err.status,
        statusText: err.response?.data.code || err.code,
      });
    }

    throw err;
  }
};

export default refreshTokenLoader;
