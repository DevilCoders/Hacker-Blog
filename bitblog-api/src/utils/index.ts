/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Generate a random username (e.g. user-abc123)
 */
export const genUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);

  const username = usernamePrefix + randomChars;

  return username;
};

/**
 * Generate a random slug from a title (e.g. my-title-abc123)
 * @param title The title to generate a slug from
 * @returns A random slug
 */
export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomChars = Math.random().toString(36).slice(8);
  const slugUri = encodeURIComponent(slug);
  const uniqueSlug = `${slugUri}-${randomChars}`;

  return uniqueSlug;
};
