/**
 * Time Formatting Utilities
 *
 * Provides relative time formatting for history item timestamps.
 * No external dependency — uses simple arithmetic.
 */

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 604_800_000;

/**
 * Formats a timestamp (Date.now() value) as a human-readable relative string.
 *
 * Examples:
 * - "just now"   (< 1 minute)
 * - "2m ago"     (< 1 hour)
 * - "3h ago"     (< 1 day)
 * - "2d ago"     (< 1 week)
 * - "Jan 5"      (this year, > 1 week)
 * - "Jan 5, 2024" (previous years)
 */
export function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`;

  const date = new Date(timestamp);
  const currentYear = new Date().getFullYear();
  const month = date.toLocaleString('en', { month: 'short' });
  const day = date.getDate();

  if (date.getFullYear() === currentYear) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${date.getFullYear()}`;
}
