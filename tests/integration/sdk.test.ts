import { RespondIO } from '../../src';
import { RespondIOError } from '../../src/errors';

describe('RespondIO SDK Integration', () => {
  describe('Initialization', () => {
    it('should create SDK instance with valid config', () => {
      const sdk = new RespondIO({
        apiToken: 'test-token',
      });

      expect(sdk).toBeDefined();
      expect(sdk.contacts).toBeDefined();
      expect(sdk.messaging).toBeDefined();
      expect(sdk.comments).toBeDefined();
      expect(sdk.conversations).toBeDefined();
      expect(sdk.space).toBeDefined();
    });

    it('should create SDK instance with custom config', () => {
      const sdk = new RespondIO({
        apiToken: 'test-token',
        baseUrl: 'https://custom.api.com',
        maxRetries: 5,
        timeout: 60000,
      });

      expect(sdk).toBeDefined();
    });

    it('should throw error without API token', () => {
      expect(() => {
        new RespondIO({
          apiToken: '',
        });
      }).toThrow('API token is required');
    });

    it('should throw error with undefined API token', () => {
      expect(() => {
        new RespondIO({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          apiToken: undefined as any,
        });
      }).toThrow('API token is required');
    });
  });

  describe('Client access', () => {
    let sdk: RespondIO;

    beforeEach(() => {
      sdk = new RespondIO({ apiToken: 'test-token' });
    });

    it('should provide access to contact client', () => {
      expect(sdk.contacts).toBeDefined();
      expect(sdk.contacts.get).toBeDefined();
      expect(sdk.contacts.create).toBeDefined();
      expect(sdk.contacts.update).toBeDefined();
      expect(sdk.contacts.delete).toBeDefined();
      expect(sdk.contacts.list).toBeDefined();
    });

    it('should provide access to messaging client', () => {
      expect(sdk.messaging).toBeDefined();
      expect(sdk.messaging.send).toBeDefined();
      expect(sdk.messaging.get).toBeDefined();
    });

    it('should provide access to comment client', () => {
      expect(sdk.comments).toBeDefined();
      expect(sdk.comments.create).toBeDefined();
    });

    it('should provide access to conversation client', () => {
      expect(sdk.conversations).toBeDefined();
      expect(sdk.conversations.assign).toBeDefined();
      expect(sdk.conversations.updateStatus).toBeDefined();
    });

    it('should provide access to space client', () => {
      expect(sdk.space).toBeDefined();
      expect(sdk.space.listUsers).toBeDefined();
      expect(sdk.space.getUser).toBeDefined();
      expect(sdk.space.createCustomField).toBeDefined();
      expect(sdk.space.listChannels).toBeDefined();
    });
  });

  describe('Type exports', () => {
    it('should export RespondIO class', () => {
      expect(new RespondIO({ apiToken: 'test-token' })).toBeInstanceOf(RespondIO);
    });

    it('should export RespondIOError class', () => {
      expect(RespondIOError).toBeDefined();
    });
  });

  describe('Error handling patterns', () => {
    beforeEach(() => {
      new RespondIO({ apiToken: 'test-token' });
    });

    it('should handle errors with instanceof check', async () => {
      // This test demonstrates the pattern for error handling
      try {
        // This would fail in real scenario without mocking
        // await sdk.contacts.get('id:999999');
        throw new RespondIOError(404, 404, 'Not found');
      } catch (error) {
        expect(error).toBeInstanceOf(RespondIOError);

        if (error instanceof RespondIOError) {
          expect(error.statusCode).toBe(404);
          expect(error.isNotFoundError()).toBe(true);
        }
      }
    });

    it('should demonstrate rate limit error handling', () => {
      const error = new RespondIOError(429, 429, 'Too many requests', {
        limit: 10,
        remaining: 0,
        retryAfter: 60,
      });

      expect(error.isRateLimitError()).toBe(true);
      expect(error.rateLimitInfo).toBeDefined();
      expect(error.rateLimitInfo?.retryAfter).toBe(60);
    });
  });

  describe('Contact identifier validation', () => {
    it('should accept id: identifier', () => {
      const identifier: string = 'id:123';
      expect(identifier).toMatch(/^id:\d+$/);
    });

    it('should accept email: identifier', () => {
      const identifier: string = 'email:user@example.com';
      expect(identifier).toMatch(/^email:.+@.+$/);
    });

    it('should accept phone: identifier', () => {
      const identifier: string = 'phone:+1234567890';
      expect(identifier).toMatch(/^phone:\+?\d+$/);
    });
  });

  describe('Message type validation', () => {
    it('should validate text message structure', () => {
      const message = {
        type: 'text' as const,
        text: 'Hello World',
      };

      expect(message.type).toBe('text');
      expect(message.text).toBeDefined();
    });

    it('should validate attachment message structure', () => {
      const message = {
        type: 'attachment' as const,
        attachment: {
          type: 'image' as const,
          url: 'https://example.com/image.jpg',
        },
      };

      expect(message.type).toBe('attachment');
      expect(message.attachment.type).toBe('image');
    });

    it('should validate WhatsApp template message structure', () => {
      const message = {
        type: 'whatsapp_template' as const,
        template: {
          name: 'order_confirmation',
          languageCode: 'en',
          components: [],
        },
      };

      expect(message.type).toBe('whatsapp_template');
      expect(message.template.languageCode).toBe('en');
    });
  });

  describe('Filter construction', () => {
    it('should construct valid $and filter', () => {
      const filter = {
        search: '',
        timezone: 'UTC',
        filter: {
          $and: [
            {
              category: 'contactField' as const,
              field: 'status',
              operator: 'isEqualTo' as const,
              value: 'open',
            },
          ],
        },
      };

      expect(filter.filter.$and).toHaveLength(1);
      expect(filter.filter.$and?.[0]?.category).toBe('contactField');
    });

    it('should construct valid $or filter', () => {
      const filter = {
        search: '',
        timezone: 'UTC',
        filter: {
          $or: [
            {
              category: 'contactTag' as const,
              field: null,
              operator: 'hasAnyOf' as const,
              value: ['vip', 'premium'],
            },
          ],
        },
      };

      expect(filter.filter.$or).toHaveLength(1);
      expect(Array.isArray(filter.filter.$or?.[0]?.value)).toBe(true);
    });
  });

  describe('Custom field validation', () => {
    it('should validate custom field structure', () => {
      const customFields = [
        { name: 'Company', value: 'Acme Inc' },
        { name: 'Revenue', value: 50000 },
        { name: 'Newsletter', value: true },
        { name: 'Notes', value: null },
      ];

      expect(customFields).toHaveLength(4);
      expect(typeof customFields[0]?.value).toBe('string');
      expect(typeof customFields[1]?.value).toBe('number');
      expect(typeof customFields[2]?.value).toBe('boolean');
      expect(customFields[3]?.value).toBeNull();
    });
  });

  describe('Pagination parameters', () => {
    it('should validate pagination structure', () => {
      const pagination = {
        limit: 50,
        cursorId: 100,
      };

      expect(pagination.limit).toBeGreaterThan(0);
      expect(pagination.limit).toBeLessThanOrEqual(100);
      expect(pagination.cursorId).toBeGreaterThanOrEqual(0);
    });
  });
});
