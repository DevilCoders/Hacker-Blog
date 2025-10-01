/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { redirect } from 'react-router';

/**
 * Custom modules
 */
import { bitblogApi } from '@/api';

/**
 * Types
 */
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse } from '@/types';

const settingsAction: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');

  try {
    const response = await bitblogApi.put('/users/current', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    const responseData = response.data;

    localStorage.setItem('user', JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        ok: false,
        err: err.response?.data,
      } as ActionResponse;
    }

    throw err;
  }
};

export default settingsAction;
