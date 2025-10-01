/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { useCallback } from 'react';
import { useCurrentEditor } from '@tiptap/react';

/**
 * Custom modules
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

/**
 * Assets
 */
import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HeadingIcon,
  ItalicIcon,
  StrikethroughIcon,
  Undo2Icon,
  Redo2Icon,
  TextQuoteIcon,
  CodeSquareIcon,
  ChevronDownIcon,
  ListIcon,
  ListOrderedIcon,
} from 'lucide-react';

/**
 * Types
 */
import type { LucideProps } from 'lucide-react';
type Level = 1 | 2 | 3;
interface HeadingType {
  label: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  level: Level;
}

/**
 * Constants
 */
const HEADINGS: HeadingType[] = [
  {
    label: 'Heading 1',
    Icon: Heading1Icon,
    level: 1,
  },
  {
    label: 'Heading 2',
    Icon: Heading2Icon,
    level: 2,
  },
  {
    label: 'Heading 3',
    Icon: Heading3Icon,
    level: 3,
  },
];

export const Toolbar = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const { editor } = useCurrentEditor();

  const getActiveIcon = useCallback(() => {
    if (!editor) return <HeadingIcon />;

    const activeHeading = HEADINGS.find(({ level }) =>
      editor.isActive('heading', { level }),
    );

    if (!activeHeading?.level) return <HeadingIcon />;

    return <activeHeading.Icon />;
  }, [editor]);

  if (!editor) return null;

  const isAnyHeadingActive = editor.isActive('heading');

  return (
    <div
      className={cn('flex items-center gap-1 p-2', className)}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().undo()}
          >
            <Undo2Icon />
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Undo
          <div className='opacity-70'>Ctrl+Z</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().redo()}
          >
            <Redo2Icon />
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Redo
          <div className='opacity-70'>Ctrl+Shift+Z</div>
        </TooltipContent>
      </Tooltip>

      <Separator
        orientation='vertical'
        className='data-[orientation=vertical]:h-4'
      />

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                className='!px-2 gap-0'
                variant={isAnyHeadingActive ? 'secondary' : 'ghost'}
              >
                {getActiveIcon()}

                <ChevronDownIcon className='text-muted-foreground' />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent side='bottom'>Heading</TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align='start'
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground'>
              Heading
            </DropdownMenuLabel>

            {HEADINGS.map(({ label, Icon, level }) => (
              <DropdownMenuItem
                key={`heading-${level}`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                disabled={!editor.can().toggleHeading({ level })}
              >
                <Icon />

                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle bullet list'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            pressed={editor.isActive('bulletList')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <ListIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side='bottom'>Bullet List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle ordered list'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            pressed={editor.isActive('orderedList')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <ListOrderedIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent side='bottom'>Ordered List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle blockquote'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            pressed={editor.isActive('blockquote')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <TextQuoteIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Blockquote
          <div className='opacity-70'>Ctrl+Shift+B</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle code block'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            pressed={editor.isActive('codeBlock')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <CodeSquareIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Code Block
          <div className='opacity-70'>Ctrl+Alt+C</div>
        </TooltipContent>
      </Tooltip>

      <Separator
        orientation='vertical'
        className='data-[orientation=vertical]:h-4'
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            pressed={editor.isActive('bold')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <BoldIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Bold
          <div className='opacity-70'>Ctrl+B</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            pressed={editor.isActive('italic')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <ItalicIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Italic
          <div className='opacity-70'>Ctrl+I</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle strikethrough'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            pressed={editor.isActive('strike')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <StrikethroughIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Strike
          <div className='opacity-70'>Ctrl+Shift+S</div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label='Toggle code'
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            pressed={editor.isActive('code')}
            className='aria-pressed:bg-secondary aria-pressed:text-secondary-foreground'
          >
            <CodeIcon />
          </Toggle>
        </TooltipTrigger>

        <TooltipContent
          side='bottom'
          className='text-center'
        >
          Code
          <div className='opacity-70'>Ctrl+E</div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
