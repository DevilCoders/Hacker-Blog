/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { createBrowserRouter } from 'react-router';

/**
 * Loaders
 */
import refreshTokenLoader from '@/routes/loaders/refreshToken';
import homeLoader from '@/routes/loaders/user/home';
import userBlogLoader from '@/routes/loaders/user/blogs';
import blogDetailLoader from '@/routes/loaders/user/blogDetail';
import adminLoader from '@/routes/loaders/admin/admin';
import dashboardLoader from '@/routes/loaders/admin/dashboard';
import allBlogLoader from '@/routes/loaders/admin/blogs';
import allCommentLoader from '@/routes/loaders/admin/comments';
import allUserLoader from '@/routes/loaders/admin/users';

/**
 * Pages
 */
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { RootLayout } from '@/components/layouts/Root';
import { Home } from '@/pages/user/Home';
import { Blogs } from '@/pages/user/Blogs';
import { BlogDetail } from '@/pages/user/BlogDetail';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Blogs as AdminBlogs } from '@/pages/admin/Blogs';
import { Comments } from '@/pages/admin/Comments';
import { Users } from '@/pages/admin/Users';
import { BlogCreate } from '@/pages/admin/BlogCreate';
import { BlogEdit } from '@/pages/admin/BlogEdit';

/**
 * Actions
 */
import signupAction from '@/routes/actions/auth/signup';
import loginAction from '@/routes/actions/auth/login';
import settingsAction from '@/routes/actions/user/settings';
import blogEditAction from '@/routes/actions/admin/blogEdit';
import blogsAction from '@/routes/actions/admin/blogsAction';
import allUserAction from '@/routes/actions/admin/user';
import blogCreateAction from '@/routes/actions/admin/blogCreate';

/**
 * Error boundaries
 */
import { RootErrorBoundary } from '@/pages/error/Root';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
    action: loginAction,
  },
  {
    path: '/signup',
    Component: Signup,
    action: signupAction,
  },
  {
    path: '/refresh-token',
    loader: refreshTokenLoader,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
      {
        path: 'blogs',
        Component: Blogs,
        loader: userBlogLoader,
      },
      {
        path: 'blogs/:slug',
        Component: BlogDetail,
        loader: blogDetailLoader,
      },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    loader: adminLoader,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
        loader: dashboardLoader,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'blogs',
        Component: AdminBlogs,
        loader: allBlogLoader,
        action: blogsAction,
        handle: { breadcrumb: 'Blogs' },
      },
      {
        path: 'blogs/create',
        Component: BlogCreate,
        action: blogCreateAction,
        handle: { breadcrumb: 'Create a new blog' },
      },
      {
        path: 'blogs/:slug/edit',
        Component: BlogEdit,
        loader: blogDetailLoader,
        action: blogEditAction,
        handle: { breadcrumb: 'Edit blog' },
      },
      {
        path: 'comments',
        Component: Comments,
        loader: allCommentLoader,
        handle: { breadcrumb: 'Comments' },
      },
      {
        path: 'users',
        Component: Users,
        loader: allUserLoader,
        action: allUserAction,
        handle: { breadcrumb: 'Users' },
      },
    ],
  },
  {
    path: '/settings',
    action: settingsAction,
  },
]);

export default router;
