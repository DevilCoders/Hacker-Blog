/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

/**
 * Css
 */
import './index.css';

/**
 * Router
 */
import router from '@/routes';

/**
 * Components
 */
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />

      <Toaster richColors />
    </ThemeProvider>
  </StrictMode>,
);
