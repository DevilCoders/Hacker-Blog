/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useLoaderData, Link } from 'react-router';
import { motion } from 'motion/react';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';

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

export const AllBlogs = ({
  className,
  ...props
}: React.ComponentProps<'section'>) => {
  const { allBlog } = useLoaderData<HomeLoaderResponse>();

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
          All blog posts
        </motion.h2>

        <motion.ul
          className='grid lg:grid-cols-2 xl:grid-cols-3 gap-4'
          initial='from'
          whileInView='to'
          viewport={{ once: true }}
          variants={listVariant}
        >
          {allBlog.blogs.map(
            ({ slug, banner, title, content, author, publishedAt }) => (
              <motion.li
                key={slug}
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
                />
              </motion.li>
            ),
          )}
        </motion.ul>

        <motion.div
          className='mt-8 flex justify-center md:mt-10'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: 'backInOut',
            },
          }}
        >
          <Button
            size='lg'
            asChild
          >
            <Link
              to='/blogs'
              viewTransition
            >
              See all blogs
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
