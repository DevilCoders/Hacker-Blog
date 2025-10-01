/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useEffect, useState } from 'react';

/**
 * Types
 */
import type { User } from '@/types';
export type UserResponse = Pick<User, 'username' | 'email' | 'role'>;

export const useUser = () => {
  const [user, setUser] = useState<UserResponse>();

  useEffect(() => {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const user = JSON.parse(userJson) as UserResponse;

      setUser(user);
    }
  }, []);

  return user;
};
