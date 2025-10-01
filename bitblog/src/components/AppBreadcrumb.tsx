/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Fragment, useMemo } from 'react';
import { Link, useMatches, useLocation } from 'react-router';

/**
 * Components
 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * Types
 */
import type { UIMatch } from 'react-router';
type HandleType = {
  breadcrumb?:
    | string
    | ((args: {
        params: Record<string, string | undefined>;
        data: unknown;
      }) => string);
};

export const AppBreadcrumb = () => {
  const matches = useMatches() as UIMatch<unknown, HandleType>[];
  const location = useLocation();

  const crumbs = useMemo(
    () =>
      matches
        .filter((match) => match.handle?.breadcrumb)
        .map((match) => {
          const { handle, params, data } = match;

          const label =
            typeof handle.breadcrumb === 'function'
              ? handle.breadcrumb({ params, data })
              : handle.breadcrumb;

          return { label, href: match.pathname };
        }),
    [matches],
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem className='hidden md:block'>
              {crumb.href === location.pathname ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to={crumb.href}
                    viewTransition
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
