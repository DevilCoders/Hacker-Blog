/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useLoaderData, useFetcher } from 'react-router';
import { toast } from 'sonner';

/**
 * Components
 */
import { BlogForm } from '@/components/BlogForm';

/**
 * Types
 */
import type { Blog } from '@/types';

export const BlogEdit = () => {
  const loaderData = useLoaderData() as { blog: Blog };
  const fetcher = useFetcher();

  const blog = loaderData.blog;

  return (
    <div className='max-w-3xl w-full mx-auto p-4'>
      <BlogForm
        defaultValue={{
          bannerUrl: blog.banner.url,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }}
        onSubmit={({ banner_image, title, content }, status) => {
          const formData = new FormData();

          if (banner_image) formData.append('banner_image', banner_image);
          if (title !== blog.title) formData.append('title', title);
          if (content !== blog.content) formData.append('content', content);
          if (status !== blog.status) formData.append('status', status);

          const submitPromise = fetcher.submit(formData, {
            method: 'put',
            encType: 'multipart/form-data',
          });

          toast.promise(submitPromise, {
            loading: 'Saving Changes…',
            success: {
              message: 'Changes Saved Successfully!',
              description: 'Your updates have been saved and applied.',
            },
            error: {
              message: 'Failed to Save Changes',
              description:
                'Something went wrong while saving. Please try again.',
            },
          });
        }}
      />
    </div>
  );
};
