/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useCallback, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'sonner';

/**
 * Custom modules
 */
import { getUsername, getReadingTime } from '@/lib/utils';

/**
 * Components
 */
import { Page } from '@/components/Page';
import Avatar from 'react-avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

/**
 * Assets
 */
import {
  ArrowLeftIcon,
  FacebookIcon,
  LinkedinIcon,
  LinkIcon,
  MessageSquareIcon,
  ShareIcon,
  ThumbsUpIcon,
  TwitterIcon,
} from 'lucide-react';

/**
 * Types
 */
import type { Blog } from '@/types';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

interface ShareDropdownProps extends DropdownMenuProps {
  blogTitle: string;
}

export const ShareDropdown = ({
  blogTitle,
  children,
  ...props
}: ShareDropdownProps) => {
  const blogUrl = window.location.href;
  const shareText = 'Just read this insightful article and wanted to share!';

  const SHARE_LINKS = useMemo(() => {
    return {
      x: `https://x.com/intent/post?url=${encodeURIComponent(
        blogUrl,
      )}&text=${encodeURIComponent(`${shareText} "${blogTitle}"`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        blogUrl,
      )}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        blogUrl,
      )}&title=${encodeURIComponent(blogTitle)}&summary=${encodeURIComponent(
        shareText,
      )}`,
    };
  }, [blogTitle, blogUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      toast.success('Link copied!');
    } catch (err) {
      toast.error('Failed to copy!');
      console.error('Failed to copy: ', err);
    }
  }, [blogUrl]);

  const shareOnSocial = useCallback((platformUrl: string) => {
    window.open(platformUrl, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-[240px]'>
        <DropdownMenuItem onSelect={handleCopy}>
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.x)}>
          <TwitterIcon />
          Share on X
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.facebook)}>
          <FacebookIcon />
          Share on Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => shareOnSocial(SHARE_LINKS.linkedin)}>
          <LinkedinIcon />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const BlogDetail = () => {
  const navigate = useNavigate();

  const { blog } = useLoaderData() as { blog: Blog };

  const editor = useEditor({
    extensions: [StarterKit],
    content: blog.content,
    editable: false,
    autofocus: false,
  });

  return (
    <Page>
      <article className='relative container max-w-[720px] pt-6 pb-12'>
        <Button
          variant='outline'
          size='icon'
          className='sticky top-22 -ms-16'
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon />
        </Button>

        <h1 className='text-4xl leading-tight font-semibold -mt-10'>
          {blog.title}
        </h1>

        <div className='flex items-center gap-3 my-8'>
          <div className='flex items-center gap-3'>
            <Avatar
              email={blog.author.email}
              size='32'
              round
            />

            <span>{getUsername(blog.author)}</span>
          </div>

          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-1 data-[orientation=vertical]:w-1 rounded-full'
          />

          <div className='text-muted-foreground'>
            {getReadingTime(editor.getText() || '')} min read
          </div>

          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-1 data-[orientation=vertical]:w-1 rounded-full'
          />

          <div className='text-muted-foreground'>
            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
            })}
          </div>
        </div>

        <Separator />

        <div className='flex items-center gap-2 my-2'>
          <Button variant='ghost'>
            <ThumbsUpIcon />

            {blog.likesCount}
          </Button>

          <Button variant='ghost'>
            <MessageSquareIcon />

            {blog.commentsCount}
          </Button>

          <ShareDropdown blogTitle={blog.title}>
            <Button
              variant='ghost'
              className='ms-auto'
            >
              <ShareIcon />
              Share
            </Button>
          </ShareDropdown>
        </div>

        <Separator />

        <div className='my-8'>
          <AspectRatio
            ratio={21 / 9}
            className='overflow-hidden rounded-xl bg-border'
          >
            <img
              src={blog.banner.url}
              width={blog.banner.width}
              height={blog.banner.height}
              alt={`Banner of blog: ${blog.title}`}
              className='w-full h-full object-cover'
            />
          </AspectRatio>
        </div>

        <EditorContent editor={editor} />
      </article>
    </Page>
  );
};
