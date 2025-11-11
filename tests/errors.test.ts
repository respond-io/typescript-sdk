import { RespondIOError } from '../src/errors';

describe('RespondIOError', () => {
  describe('constructor', () => {
    it('should create error with basic properties', () => {
      const error = new RespondIOError(404, 404, 'Not found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(RespondIOError);
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.name).toBe('RespondIOError');
    });

    it('should create error with rate limit info', () => {
      const rateLimitInfo = {
        limit: 10,
        remaining: 0,
        retryAfter: 60,
      };

      const error = new RespondIOError(429, 429, 'Too many requests', rateLimitInfo);

      expect(error.rateLimitInfo).toEqual(rateLimitInfo);
    });

    it('should create error without rate limit info', () => {
      const error = new RespondIOError(400, 400, 'Bad request');

      expect(error.rateLimitInfo).toBeUndefined();
    });
  });

  describe('isRateLimitError', () => {
    it('should return true for 429 status', () => {
      const error = new RespondIOError(429, 429, 'Rate limited');

      expect(error.isRateLimitError()).toBe(true);
    });

    it('should return false for non-429 status', () => {
      const error = new RespondIOError(400, 400, 'Bad request');

      expect(error.isRateLimitError()).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('should return true for 401 status', () => {
      const error = new RespondIOError(401, 401, 'Unauthorized');

      expect(error.isAuthError()).toBe(true);
    });

    it('should return false for non-401 status', () => {
      const error = new RespondIOError(404, 404, 'Not found');

      expect(error.isAuthError()).toBe(false);
    });
  });

  describe('isNotFoundError', () => {
    it('should return true for 404 status', () => {
      const error = new RespondIOError(404, 404, 'Contact not found');

      expect(error.isNotFoundError()).toBe(true);
    });

    it('should return false for non-404 status', () => {
      const error = new RespondIOError(400, 400, 'Bad request');

      expect(error.isNotFoundError()).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for 400 status', () => {
      const error = new RespondIOError(400, 400, 'Validation error');

      expect(error.isValidationError()).toBe(true);
    });

    it('should return false for non-400 status', () => {
      const error = new RespondIOError(500, 500, 'Server error');

      expect(error.isValidationError()).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 500 status', () => {
      const error = new RespondIOError(500, 500, 'Internal server error');

      expect(error.isServerError()).toBe(true);
    });

    it('should return true for 502 status', () => {
      const error = new RespondIOError(502, 502, 'Bad gateway');

      expect(error.isServerError()).toBe(true);
    });

    it('should return true for 503 status', () => {
      const error = new RespondIOError(503, 503, 'Service unavailable');

      expect(error.isServerError()).toBe(true);
    });

    it('should return false for 4xx status', () => {
      const error = new RespondIOError(404, 404, 'Not found');

      expect(error.isServerError()).toBe(false);
    });

    it('should return false for 2xx status', () => {
      const error = new RespondIOError(200, 200, 'OK');

      expect(error.isServerError()).toBe(false);
    });
  });

  describe('Error prototype chain', () => {
    it('should maintain correct prototype chain', () => {
      const error = new RespondIOError(500, 500, 'Error');

      expect(Object.getPrototypeOf(error)).toBe(RespondIOError.prototype);
    });

    it('should be catchable as Error', () => {
      try {
        throw new RespondIOError(500, 500, 'Test error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(RespondIOError);
      }
    });
  });

  describe('Error serialization', () => {
    it('should serialize to JSON correctly', () => {
      const error = new RespondIOError(404, 404, 'Not found', {
        limit: 10,
        remaining: 5,
        retryAfter: 60,
      });

      const json = JSON.stringify(error);
      const parsed = JSON.parse(json);

      expect(parsed).toMatchObject({
        statusCode: 404,
        code: 404,
        message: 'Not found',
        rateLimitInfo: {
          limit: 10,
          remaining: 5,
          retryAfter: 60,
        },
      });
    });
  });
});
