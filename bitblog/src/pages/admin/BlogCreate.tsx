/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useFetcher } from 'react-router';
import { toast } from 'sonner';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { BlogForm } from '@/components/BlogForm';

export const BlogCreate = () => {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <div
      className={cn(
        'max-w-3xl w-full mx-auto p-4',
        isSubmitting && 'opacity-50 pointer-events-none',
      )}
    >
      <BlogForm
        onSubmit={({ banner_image, title, content }, status) => {
          if (!banner_image) return;

          const formData = new FormData();

          formData.append('banner_image', banner_image);
          formData.append('title', title);
          formData.append('content', content);
          formData.append('status', status);

          const submitPromise = fetcher.submit(formData, {
            method: 'post',
            encType: 'multipart/form-data',
          });

          toast.promise(submitPromise, {
            loading: 'Publishing blog...',
            success: {
              message: 'Blog Published Successfully!',
              description: 'Your blog is now live and visible to everyone.',
            },
            error: {
              message: 'Failed to Publish Blog',
              description:
                'Something went wrong while publishing your blog. Please try again later.',
            },
          });
        }}
      />
    </div>
  );
};
