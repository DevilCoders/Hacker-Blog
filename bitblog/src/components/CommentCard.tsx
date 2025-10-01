/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';

/**
 * Components
 */
import Avatar from 'react-avatar';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

/**
 * Assets
 */
import {
  ThumbsUpIcon,
  TrashIcon,
  SquareArrowOutUpRightIcon,
} from 'lucide-react';

/**
 * Types
 */
import type { User, Blog } from '@/types';
type Props = {
  content: string;
  likesCount: number;
  user: User | null;
  blog: Blog;
  createdAt: string;
};

export const CommentCard = ({
  content,
  likesCount,
  user,
  blog,
  createdAt,
}: Props) => {
  return (
    <div className='@container'>
      <div className='group flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-accent/25 @md:flex-row'>
        <Avatar
          email={user?.email}
          size='40'
          round
        />

        <div className='flex flex-col gap-2 me-auto'>
          <div className='flex items-center gap-2'>
            {user ? (
              <div className='text-sm text-muted-foreground'>
                @{user.username}
              </div>
            ) : (
              <div className='text-sm text-destructive/80 italic'>
                <Tooltip delayDuration={250}>
                  <TooltipTrigger>Account deleted</TooltipTrigger>

                  <TooltipContent>This account has been removed</TooltipContent>
                </Tooltip>
              </div>
            )}

            <div className='size-1 rounded-full bg-muted-foreground/50'></div>

            <div className='text-sm text-muted-foreground'>
              <Tooltip delayDuration={250}>
                <TooltipTrigger>
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </TooltipTrigger>

                <TooltipContent>
                  {new Date(createdAt).toLocaleString('en-US', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className='max-w-[60ch]'>{content}</div>

          <div className='flex items-center gap-2 mt-1'>
            <Button
              variant='ghost'
              aria-label='Like comment'
            >
              <ThumbsUpIcon />

              {likesCount > 0 && (
                <span className='sr-only'>Total likes: ${likesCount}</span>
              )}
            </Button>

            <Button
              variant='ghost'
              aria-label='Remove comment'
            >
              <TrashIcon />
              Remove
            </Button>
          </div>
        </div>

        {blog && (
          <>
            <div className='max-w-80 grid grid-cols-[120px_minmax(200px,_1fr)] gap-3 @max-3xl:hidden'>
              <AspectRatio
                ratio={21 / 9}
                className='rounded-lg overflow-hidden'
              >
                <img
                  src={blog.banner.url}
                  width={blog.banner.width}
                  height={blog.banner.height}
                  alt={blog.title}
                />
              </AspectRatio>

              <div className='line-clamp-3 max-w-[30ch] text-sm text-muted-foreground my-1'>
                {blog.title}
              </div>
            </div>

            <Button
              variant='ghost'
              className='@3xl:invisible @xl:group-hover:visible @xl:group-focus-within:visible'
              asChild
            >
              <Link
                to={`/blogs/${blog.slug}`}
                viewTransition
              >
                <span className='@md:hidden'>Go to blog</span>

                <SquareArrowOutUpRightIcon />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
