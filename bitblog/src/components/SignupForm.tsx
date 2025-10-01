/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Link, useFetcher, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputPassword } from '@/components/InputPassword';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

/**
 * Assets
 */
import { signupBanner } from '@/assets';
import { LoaderCircleIcon } from 'lucide-react';

/**
 * Types
 */
import type {
  ActionResponse,
  AuthResponse,
  ErrorResponse,
  ValidationError,
} from '@/types';
type SignupField = 'email' | 'password' | 'role';

/**
 * Constants
 */
const SIGNUP_FORM = {
  title: 'Create an account',
  description: 'Enter your email below to create an account',
  footerText: 'Already have an account?',
} as const;

/**
 * Signup form schema
 */
const formSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .max(50, 'Email must be less than 50 characters')
    .email('Invalid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['user', 'admin']),
});

export const SignupForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const signupResponse = fetcher.data as ActionResponse<AuthResponse>;

  const isLoading = fetcher.state !== 'idle';

  // React hook form initial
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  // Handle server error response
  useEffect(() => {
    if (!signupResponse) return;

    if (signupResponse.ok) {
      navigate('/', { viewTransition: true });
      return;
    }

    if (!signupResponse.err) return;

    if (signupResponse.err.code === 'AuthorizationError') {
      const authorizationError = signupResponse.err as ErrorResponse;

      toast.error(authorizationError.message, {
        position: 'top-center',
      });
    }

    if (signupResponse.err.code === 'ValidationError') {
      const validationErrors = signupResponse.err as ValidationError;

      Object.entries(validationErrors.errors).forEach((value) => {
        const [, validationError] = value;
        const signupField = validationError.path as SignupField;

        form.setError(
          signupField,
          {
            type: 'custom',
            message: validationError.msg,
          },
          { shouldFocus: true },
        );
      });
    }
  }, [signupResponse]);

  // Handle form submission
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    await fetcher.submit(values, {
      action: '/signup',
      method: 'post',
      encType: 'application/json',
    });
  }, []);

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form
              className='p-6 md:p-8'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-semibold'>
                    {SIGNUP_FORM.title}
                  </h1>

                  <p className='text-muted-foreground px-6'>
                    {SIGNUP_FORM.description}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Register as</FormLabel>

                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid grid-cols-2 gap-0 border border-input rounded-md p-0.5'
                        >
                          <Label className='h-[34px] w-full grid place-items-center rounded-s-sm text-muted-foreground hover:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground'>
                            <RadioGroupItem
                              value='user'
                              className='sr-only'
                            />
                            User
                          </Label>

                          <Label className='h-[34px] w-full grid place-items-center rounded-e-sm text-muted-foreground hover:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground'>
                            <RadioGroupItem
                              value='admin'
                              className='sr-only'
                            />
                            Admin
                          </Label>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input
                          placeholder='john@example.com'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <InputPassword
                          placeholder='Enter your password'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isLoading}
                >
                  {isLoading && <LoaderCircleIcon className='animate-spin' />}

                  <span>Signup</span>
                </Button>
              </div>

              <div className='mt-4 text-center text-sm'>
                {SIGNUP_FORM.footerText}{' '}
                <Link
                  to='/login'
                  className='underline underline-offset-4 hover:text-primary'
                  viewTransition
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>

          <figure className='bg-muted relative hidden md:block'>
            <img
              src={signupBanner}
              width={400}
              height={400}
              alt='Login banner'
              className='absolute inset-0 w-full h-full object-cover'
            />
          </figure>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
};
