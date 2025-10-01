/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useState } from 'react';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';

/**
 * Assets
 */
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

/**
 * Types
 */
type InputPasswordProps = Omit<React.ComponentProps<'input'>, 'type'>;

export const InputPassword: React.FC<InputPasswordProps> = ({
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn(
          'pe-12 placeholder:tracking-normal',
          !showPassword && 'tracking-widest',
          className,
        )}
        {...props}
      />

      <Toggle
        type='button'
        pressed={showPassword}
        onPressedChange={setShowPassword}
        className='absolute top-1/2 -translate-y-1/2 right-0.5 size-8'
      >
        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
      </Toggle>
    </div>
  );
};
