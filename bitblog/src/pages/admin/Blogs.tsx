/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useLoaderData, useFetcher } from 'react-router';
import { useEffect, useState } from 'react';

/**
 * Components
 */
import { columns, BlogTable } from '@/components/BlogTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

/**
 * Assets
 */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2Icon,
} from 'lucide-react';

/**
 * Types
 */
import type { Blog, PaginatedResponse } from '@/types';
type PaginateTo = 'first' | 'last' | 'previous' | 'next' | null;

/**
 * Constants
 */
const LIMITS = [5, 10, 20, 30, 40];

export const Blogs = () => {
  const fetcher = useFetcher();
  const loaderData = useLoaderData() as PaginatedResponse<Blog, 'blogs'>;
  const fetcherData = fetcher.data as PaginatedResponse<Blog, 'blogs'>;

  const { offset, limit, total, blogs } = fetcherData || loaderData;

  const [currentOffset, setCurrentOffset] = useState(offset);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const [paginateTo, setPaginateTo] = useState<PaginateTo>();

  const isPaginating =
    fetcher.state === 'loading' &&
    fetcher.formMethod === 'GET' &&
    fetcher.formAction === '/admin/blogs';

  const showingFrom = offset + 1;
  const showingTo = total <= limit ? total : offset + limit;

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('offset', currentOffset.toString());
    searchParams.set('limit', currentLimit.toString());

    fetcher.submit(searchParams.toString());
  }, [currentOffset, currentLimit]);

  const totalPage = Math.ceil(total / limit);
  const currentPage = Math.ceil((offset + 1) / limit);

  return (
    <div className='container p-4 space-y-4'>
      <h2 className='text-2xl font-semibold'>All Blogs</h2>

      <BlogTable
        columns={columns}
        data={blogs}
      />

      <div className='flex items-center justify-between px-4 pb-4'>
        <div className='text-muted-foreground flex flex-1 text-sm font-medium'>
          Showing {showingFrom} - {showingTo} of {total} blogs
        </div>

        <div className='flex w-fit items-center gap-8'>
          <div className='flex items-center gap-2'>
            <Label
              htmlFor='limit'
              className='text-sm font-medium'
            >
              Rows per page
            </Label>

            <Select
              value={currentLimit.toString()}
              onValueChange={(limit) => {
                const limitN = Number(limit);
                setCurrentLimit(limitN);
                setPaginateTo(null);

                const inLastPage = currentPage === totalPage;

                if (inLastPage && offset !== 0) {
                  setCurrentOffset(total - (total % limitN || limitN));
                }
              }}
            >
              <SelectTrigger
                id='limit'
                size='sm'
                className='w-20'
              >
                <SelectValue placeholder={limit} />
              </SelectTrigger>

              <SelectContent side='top'>
                {LIMITS.map((limit) => (
                  <SelectItem
                    key={limit}
                    value={limit.toString()}
                  >
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex w-fit items-center justify-center text-sm font-medium'>
            Page {currentPage} of {totalPage}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              className='size-8 p-0'
              disabled={currentPage <= 1}
              aria-label='Go to first page'
              onClick={() => {
                setCurrentOffset(0);
                setPaginateTo('first');
              }}
            >
              {isPaginating && paginateTo === 'first' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <ChevronsLeftIcon />
              )}
            </Button>

            <Button
              variant='outline'
              className='size-8 p-0'
              disabled={currentPage <= 1}
              aria-label='Go to previous page'
              onClick={() => {
                setCurrentOffset(offset - limit);
                setPaginateTo('previous');
              }}
            >
              {isPaginating && paginateTo === 'previous' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <ChevronLeftIcon />
              )}
            </Button>

            <Button
              variant='outline'
              className='size-8 p-0'
              disabled={currentPage >= totalPage}
              aria-label='Go to next page'
              onClick={() => {
                setCurrentOffset(offset + limit);
                setPaginateTo('next');
              }}
            >
              {isPaginating && paginateTo === 'next' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <ChevronRightIcon />
              )}
            </Button>

            <Button
              variant='outline'
              className='size-8 p-0'
              disabled={currentPage >= totalPage}
              aria-label='Go to last page'
              onClick={() => {
                setCurrentOffset(total - (total % limit || limit));
                setPaginateTo('last');
              }}
            >
              {isPaginating && paginateTo === 'last' ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <ChevronsRightIcon />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
