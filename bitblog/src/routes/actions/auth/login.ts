/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { bitblogApi } from '@/api';

/**
 * Types
 */
import type { ActionFunction } from 'react-router';
import { AxiosError } from 'axios';
import type { ActionResponse, AuthResponse } from '@/types';

const loginAction: ActionFunction = async ({ request }) => {
  const data = await request.json();

  try {
    const response = await bitblogApi.post('/auth/login', data, {
      withCredentials: true,
    });
    const responseData = response.data as AuthResponse;

    localStorage.setItem('accessToken', responseData.accessToken);
    localStorage.setItem('user', JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    } as ActionResponse<AuthResponse>;
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

export default loginAction;
