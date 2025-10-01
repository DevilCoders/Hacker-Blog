/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useLoaderData, useFetcher } from 'react-router';
import { useEffect, useState, useMemo, useCallback } from 'react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/UserCard';

/**
 * Custom hooks
 */
import { useUser } from '@/hooks/useUser';

/**
 * Assets
 */
import { Loader2Icon } from 'lucide-react';

/**
 * Types
 */
import type { User, PaginatedResponse } from '@/types';

export const Users = () => {
  const fetcher = useFetcher();
  const loggedInUser = useUser();

  const loaderData = useLoaderData() as PaginatedResponse<User, 'users'>;
  const fetcherData = fetcher.data as PaginatedResponse<User, 'users'>;

  const { offset, limit, total, users } = useMemo(
    () => fetcherData || loaderData,
    [fetcherData, loaderData],
  );

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const handleLoadMore = useCallback((offset: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('offset', offset.toString());

    fetcher.submit(searchParams.toString());
  }, []);

  useEffect(() => {
    setAllUsers((prevUsers) => [...prevUsers, ...users]);
  }, [users]);

  const hasMoreComments = offset + limit < total;
  const isLoading =
    fetcher.state === 'loading' && fetcher.formAction === '/admin/users';

  return (
    <div className='container p-4 space-y-4'>
      <h2 className='text-2xl font-semibold'>Users</h2>

      <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-3'>
        {allUsers.map(
          ({ _id, username, firstName, lastName, email, role, createdAt }) => (
            <UserCard
              key={_id}
              userId={_id}
              username={username}
              firstName={firstName}
              lastName={lastName}
              email={email}
              role={role}
              createdAt={createdAt}
              loggedInUser={loggedInUser}
              onUserDeleteSuccess={() => {
                setAllUsers((prevUsers) =>
                  prevUsers.filter((user) => user._id !== _id),
                );
              }}
            />
          ),
        )}
      </div>

      <div className='flex justify-center my-4'>
        {hasMoreComments ? (
          <Button
            variant='outline'
            onClick={handleLoadMore.bind(null, offset + limit)}
            disabled={isLoading}
          >
            Load more
            {isLoading && <Loader2Icon className='animate-spin' />}
          </Button>
        ) : (
          <p className='text-muted-foreground text-sm'>No more users</p>
        )}
      </div>
    </div>
  );
};
