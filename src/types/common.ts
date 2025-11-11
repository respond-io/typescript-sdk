/**
 * Common types used across the SDK
 */

/**
 * Contact identifier types
 */
export type ContactIdentifier = `id:${number}` | `email:${string}` | `phone:${string}`;

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Number of items to return (1-100, default: 10) */
  limit?: number;
  /** Cursor ID for pagination */
  cursorId?: number;
}

/**
 * Pagination response
 */
export interface PaginationResponse {
  next: string;
  previous: string;
}

/**
 * Standard success response with contact ID
 */
export interface ContactActionResponse {
  contactId: number;
}

/**
 * Standard API error response
 */
export interface APIError {
  code: number;
  message: string;
}

/**
 * Rate limit information from API response headers
 */
export interface RateLimitInfo {
  /** Number of requests allowed for this endpoint */
  limit: number;
  /** Number of requests remaining for this endpoint */
  remaining: number;
  /** Number of seconds until rate limit resets */
  retryAfter?: number;
}
