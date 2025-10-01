/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';

/**
 * Components
 */
import { Toolbar } from '@/components/Toolbar';

/**
 * Types
 */
import type { EditorProviderProps } from '@tiptap/react';
type TiptapProps = Omit<EditorProviderProps, 'extensions' | 'slotBefore'>;

/**
 * Initial extensions and content for tiptap editor
 */
const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: 'Blog content goes here...',
  }),
];

export const Tiptap: React.FC<TiptapProps> = ({ ...props }) => {
  return (
    <EditorProvider
      extensions={extensions}
      slotBefore={
        <Toolbar className='sticky top-16 bg-background z-10 rounded-t-xl' />
      }
      editorContainerProps={{ className: 'p-4' }}
      {...props}
    ></EditorProvider>
  );
};
