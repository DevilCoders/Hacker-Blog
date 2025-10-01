/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Hooks
 */
import { useTheme } from '@/components/ThemeProvider';

/**
 * Assets
 */
import { Moon, Sun, CheckIcon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
        >
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
          {theme === 'light' && <CheckIcon className='ms-auto' />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
          {theme === 'dark' && <CheckIcon className='ms-auto' />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
          {theme === 'system' && <CheckIcon className='ms-auto' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
