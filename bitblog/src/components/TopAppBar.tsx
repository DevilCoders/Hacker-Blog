/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Link, useLocation, useNavigation } from 'react-router';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppBreadcrumb } from '@/components/AppBreadcrumb';
import { TopBarProgress } from '@/components/TopBarProgress';

/**
 * Assets
 */
import { PlusIcon } from 'lucide-react';
import type React from 'react';

export const TopAppBar = ({
  className,
  ...props
}: React.ComponentProps<'header'>) => {
  const location = useLocation();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  return (
    <header
      className={cn(
        'relative flex h-16 shrink-0 items-center gap-2 px-4',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        <SidebarTrigger />

        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />

        <AppBreadcrumb />
      </div>

      <div className='flex items-center gap-2 ms-auto'>
        {location.pathname !== '/admin/blogs/create' && (
          <Button asChild>
            <Link
              to='/admin/blogs/create'
              viewTransition
            >
              <PlusIcon />
              Write a blog
            </Link>
          </Button>
        )}

        <ThemeToggle />
      </div>

      {isLoading && <TopBarProgress />}
    </header>
  );
};
