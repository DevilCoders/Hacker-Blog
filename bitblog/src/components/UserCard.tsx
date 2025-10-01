/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from 'sonner';
import { useFetcher } from 'react-router';

/**
 * Components
 */
import { Card, CardContent } from '@/components/ui/card';
import Avatar from 'react-avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

/**
 * Assets
 */
import { Trash2Icon } from 'lucide-react';
import type { UserResponse } from '@/hooks/useUser';

/**
 * Types
 */
type Props = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
  loggedInUser?: UserResponse;
  onUserDeleteSuccess?: () => void;
};

export const UserCard = ({
  userId,
  email,
  firstName,
  lastName,
  username,
  role,
  createdAt,
  loggedInUser,
  onUserDeleteSuccess,
}: Props) => {
  const fetcher = useFetcher();

  return (
    <Card className='group py-4'>
      <CardContent className='grid grid-cols-[max-content_minmax(0,1fr)_max-content] gap-4 px-4'>
        <Avatar
          size='40'
          email={email}
          name={firstName || lastName ? [firstName, lastName].join(' ') : email}
          className='rounded-lg'
        />

        <div>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold'>
              {firstName || lastName
                ? [firstName, lastName].join(' ')
                : username}
            </h3>

            {role === 'admin' && (
              <Badge
                variant='outline'
                className='capitalize'
              >
                {role}
              </Badge>
            )}
          </div>

          <p className='text-sm text-muted-foreground truncate'>{email}</p>

          <div className='text-xs text-muted-foreground mt-2'>
            <Tooltip delayDuration={250}>
              <TooltipTrigger>
                Joined{' '}
                {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
              </TooltipTrigger>

              <TooltipContent side='right'>
                {new Date(createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {loggedInUser?.username !== username && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='ms-auto -mt-1.5 xl:opacity-0 xl:group-hover:opacity-100'
                aria-label='Delete user'
              >
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete User Account: {email}?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete this user account? <br /> This
                  action is permanent and cannot be undone. All user-related
                  data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    const submitPromise = fetcher.submit(
                      { userId },
                      {
                        action: '/admin/users',
                        method: 'delete',
                        encType: 'application/json',
                      },
                    );

                    toast.promise(submitPromise, {
                      loading: 'Deleting User Account...',
                      success: () => {
                        if (onUserDeleteSuccess) onUserDeleteSuccess();

                        return {
                          message: 'User Account Deleted',
                          description:
                            'The user account has been permanently removed from the system.',
                        };
                      },
                    });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};
