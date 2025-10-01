/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useLoaderData } from 'react-router';
import { motion } from 'motion/react';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { BlogCard } from '@/components/BlogCard';

/**
 * Types
 */
import type { Variants } from 'motion/react';
import type { HomeLoaderResponse } from '@/routes/loaders/user/home';

/**
 * Motion variants
 */
const listVariant: Variants = {
  to: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariant: Variants = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'backInOut',
    },
  },
};

export const RecentBlogs = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { recentBlog } = useLoaderData<HomeLoaderResponse>();

  return (
    <section
      className={cn('section', className)}
      {...props}
    >
      <div className='container'>
        <motion.h2
          className='section-title'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: 'easeOut',
            },
          }}
        >
          Recent blog posts
        </motion.h2>

        <motion.ul
          className='grid gap-4 lg:grid-cols-2 lg:grid-rows-3'
          initial='from'
          whileInView='to'
          viewport={{ once: true }}
          variants={listVariant}
        >
          {recentBlog.blogs.map(
            ({ slug, banner, title, content, author, publishedAt }, index) => (
              <motion.li
                key={slug}
                className={cn(index === 0 && 'lg:row-span-3')}
                variants={itemVariant}
              >
                <BlogCard
                  bannerUrl={banner.url}
                  bannerWidth={banner.width}
                  bannerHeight={banner.height}
                  title={title}
                  content={content}
                  slug={slug}
                  authorName={`${author.firstName} ${author.lastName}`}
                  publishedAt={publishedAt}
                  size={index > 0 ? 'sm' : 'default'}
                />
              </motion.li>
            ),
          )}
        </motion.ul>
      </div>
    </section>
  );
};
