/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import axios from 'axios';

export const bitblogApi = axios.create({
  baseURL: '/api/v1',
});
