/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router';

/**
 * Components
 */
import { Button } from '@/components/ui/button';

export const RootErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  if (isRouteErrorResponse(error)) {
    const tokenExpired =
      error.status === 401 && error.data.includes('token expired');

    if (tokenExpired) {
      return <Navigate to={`/refresh-token?redirect=${location.pathname}`} />;
    }

    return (
      <div className='h-dvh grid place-content-center place-items-center gap-4'>
        <h1 className='text-4xl font-semibold'>
          {error.status} {error.statusText}
        </h1>

        <p className='text-muted-foreground max-w-[60ch] text-center text-balance'>
          {error.data}
        </p>

        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1 className='text-4xl font-semibold'>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};
