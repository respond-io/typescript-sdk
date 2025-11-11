/**
 * Error classes for the SDK
 */

import { RateLimitInfo } from '../types/common';

/**
 * Custom error class for API errors
 */
export class RespondIOError extends Error {
  constructor(
    public statusCode: number,
    public code: number,
    message: string,
    public rateLimitInfo?: RateLimitInfo
  ) {
    super(message);
    this.name = 'RespondIOError';
    Object.setPrototypeOf(this, RespondIOError.prototype);
  }

  /**
   * Check if error is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.statusCode === 429;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is a not found error
   */
  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if error is a server error
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Return a JSON representation of the error
   */
  toJSON() {
    return {
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      rateLimitInfo: this.rateLimitInfo,
    };
  }
}
