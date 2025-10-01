/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Link, useLocation } from 'react-router';

/**
 * Components
 */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { SidebarUserMenu } from '@/components/SidebarUserMenu';

/**
 * Assets
 */
import {
  LayoutDashboardIcon,
  TextIcon,
  MessageSquareIcon,
  UserIcon,
} from 'lucide-react';

/**
 * Constants
 */
const MAIN_MENU = [
  {
    label: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Blogs',
    url: '/admin/blogs',
    icon: TextIcon,
  },
  {
    label: 'Comments',
    url: '/admin/comments',
    icon: MessageSquareIcon,
  },
  {
    label: 'Users',
    url: '/admin/users',
    icon: UserIcon,
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();

  return (
    <Sidebar
      variant='inset'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg'>
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>

          <SidebarMenu>
            {MAIN_MENU.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={location.pathname === item.url}
                  tooltip={item.label}
                  asChild
                >
                  <Link
                    to={item.url}
                    viewTransition
                  >
                    <item.icon />

                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
