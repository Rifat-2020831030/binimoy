/**
 * Input Validation Utilities
 *
 * Provides validation helpers for QR code input text/URLs,
 * including type detection and domain extraction.
 */

import type { InputType } from '$lib/types';

/** Maximum character length for QR code data (version 40, binary, level L) */
const MAX_QR_LENGTH = 2953;

/**
 * Checks whether a string is a valid URL.
 * Uses the URL constructor for robust validation.
 */
export function isValidURL(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Classifies the input string into one of four types:
 * - 'empty'    — nothing to encode
 * - 'too-long' — exceeds QR capacity
 * - 'url'      — a valid http(s) URL
 * - 'text'     — any other non-empty string
 */
export function getInputType(input: string): InputType {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 'empty';
  if (trimmed.length > MAX_QR_LENGTH) return 'too-long';
  if (isValidURL(trimmed)) return 'url';
  return 'text';
}

/**
 * Extracts the domain (hostname) from a URL string.
 * Returns the original string if parsing fails.
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(text: string, maxLength = 60): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
