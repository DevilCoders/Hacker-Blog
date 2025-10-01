/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Outlet } from 'react-router';

/**
 * Components
 */
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopAppBar } from '@/components/TopAppBar';

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className='relative max-h-[calc(100dvh-16px)] overflow-auto'>
        <TopAppBar />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
