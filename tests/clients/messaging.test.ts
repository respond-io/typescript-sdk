import { MessagingClient } from '../../src/clients/messaging';
import { HTTPClient } from '../../src/client';
import {
  SendMessageRequest,
  SendMessageResponse,
  GetMessageResponse,
} from '../../src/types';

jest.mock('../../src/client');

describe('MessagingClient', () => {
  let client: MessagingClient;
  let mockHttp: jest.Mocked<HTTPClient>;

  beforeEach(() => {
    mockHttp = new HTTPClient({ apiToken: 'test' }) as jest.Mocked<HTTPClient>;
    client = new MessagingClient(mockHttp);
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('should send text message', async () => {
      const request: SendMessageRequest = {
        message: {
          type: 'text',
          text: 'Hello World',
        },
      };

      const mockResponse: SendMessageResponse = { messageId: 123456 };
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.send('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/message', request);
    });

    it('should send message with channel ID', async () => {
      const request: SendMessageRequest = {
        channelId: 999,
        message: {
          type: 'text',
          text: 'Hello',
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('email:user@example.com', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/email:user@example.com/message',
        request
      );
    });

    it('should send attachment message', async () => {
      const request: SendMessageRequest = {
        message: {
          type: 'attachment',
          attachment: {
            type: 'image',
            url: 'https://example.com/image.jpg',
          },
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/message', request);
    });

    it('should send quick reply message', async () => {
      const request: SendMessageRequest = {
        message: {
          type: 'quick_reply',
          title: 'How can we help?',
          replies: ['Support', 'Sales'],
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/message', request);
    });

    it('should send WhatsApp template message', async () => {
      const request: SendMessageRequest = {
        channelId: 12345,
        message: {
          type: 'whatsapp_template',
          template: {
            name: 'order_confirmation',
            languageCode: 'en',
            components: [
              {
                type: 'body',
                text: 'Your order {{1}} is confirmed',
                parameters: [{ type: 'text', text: '12345' }],
              },
            ],
          },
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/message', request);
    });

    it('should send email message', async () => {
      const request: SendMessageRequest = {
        channelId: 67890,
        message: {
          type: 'email',
          text: 'Email body',
          subject: 'Test Email',
          cc: ['cc@example.com'],
          attachments: [
            {
              type: 'file',
              url: 'https://example.com/doc.pdf',
              fileName: 'document.pdf',
            },
          ],
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('email:user@example.com', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/email:user@example.com/message',
        request
      );
    });

    it('should send custom payload message', async () => {
      const request: SendMessageRequest = {
        channelId: 999,
        message: {
          type: 'custom_payload',
          payload: { custom: 'data' },
        },
      };

      mockHttp.post.mockResolvedValueOnce({ messageId: 123 });

      await client.send('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/message', request);
    });
  });

  describe('get', () => {
    it('should get message by ID', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 123456,
        channelMessageId: 'msg-abc',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'Hello World',
        },
        status: [
          {
            value: 'sent',
            timestamp: 1234567890,
          },
        ],
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 123456);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/contact/id:123/message/123456');
    });

    it('should get message with different identifiers', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 123,
        channelMessageId: 456,
        contactId: 789,
        channelId: 999,
        traffic: 'incoming',
        message: {
          type: 'text',
          text: 'Hello',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      await client.get('phone:+1234567890', 123);

      expect(mockHttp.get).toHaveBeenCalledWith('/contact/phone:+1234567890/message/123');
    });

    it('should get message with sender (user)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 123456,
        channelMessageId: 'msg-abc',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'Hello World',
        },
        sender: {
          source: 'user',
          userId: 456,
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 123456);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('user');
      expect(result.sender?.userId).toBe(456);
    });

    it('should get message with sender (ai_agent)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 789,
        channelMessageId: 'msg-xyz',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'AI response',
        },
        sender: {
          source: 'ai_agent',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 789);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('ai_agent');
    });

    it('should get message with sender (workflow)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 101,
        channelMessageId: 'msg-workflow',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'Workflow message',
        },
        sender: {
          source: 'workflow',
          workflowId: 789,
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 101);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('workflow');
      expect(result.sender?.workflowId).toBe(789);
    });

    it('should get message with sender (api)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 202,
        channelMessageId: 'msg-api',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'API message',
        },
        sender: {
          source: 'api',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 202);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('api');
    });

    it('should get message with sender (broadcast)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 303,
        channelMessageId: 'msg-broadcast',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'Broadcast message',
        },
        sender: {
          source: 'broadcast',
          broadcastHistoryId: 555,
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 303);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('broadcast');
      expect(result.sender?.broadcastHistoryId).toBe(555);
    });

    it('should get message with sender (echo)', async () => {
      const mockResponse: GetMessageResponse = {
        messageId: 404,
        channelMessageId: 'msg-echo',
        contactId: 123,
        channelId: 999,
        traffic: 'outgoing',
        message: {
          type: 'text',
          text: 'Echo message',
        },
        sender: {
          source: 'echo',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.get('id:123', 404);

      expect(result).toEqual(mockResponse);
      expect(result.sender?.source).toBe('echo');
    });
  });

  describe('list', () => {
    it('should list messages without pagination', async () => {
      const mockResponse = {
        items: [
          {
            messageId: 123456,
            channelMessageId: 'msg-abc',
            contactId: 123,
            channelId: 999,
            traffic: 'outgoing' as const,
            message: {
              type: 'text' as const,
              text: 'Hello World',
            },
            status: [
              {
                value: 'sent' as const,
                timestamp: 1234567890,
              },
            ],
            sender: {
              source: 'user' as const,
              userId: 456,
            },
          },
          {
            messageId: 123457,
            channelMessageId: 'msg-def',
            contactId: 123,
            channelId: 999,
            traffic: 'incoming' as const,
            message: {
              type: 'text' as const,
              text: 'Hi there',
            },
          },
        ],
        pagination: {
          next: 'https://api.respond.io/v2/contact/id:123/message/list?limit=10&cursorId=20',
          previous: '',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.list('id:123');

      expect(result).toEqual(mockResponse);
      expect(result.items[0].sender?.source).toBe('user');
      expect(result.items[0].sender?.userId).toBe(456);
      expect(result.items[1].sender).toBeUndefined();
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/contact/id:123/message/list',
        undefined
      );
    });

    it('should list messages with pagination', async () => {
      const pagination = { limit: 50, cursorId: 100 };
      const mockResponse = {
        items: [
          {
            messageId: 123456,
            channelMessageId: 'msg-abc',
            contactId: 123,
            channelId: 999,
            traffic: 'outgoing' as const,
            message: {
              type: 'text' as const,
              text: 'Hello World',
            },
          },
        ],
        pagination: {
          next: 'https://api.respond.io/v2/contact/id:123/message/list?limit=50&cursorId=150',
          previous:
            'https://api.respond.io/v2/contact/id:123/message/list?limit=50&cursorId=50',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.list('id:123', pagination);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/contact/id:123/message/list',
        pagination
      );
    });

    it('should list messages with email identifier', async () => {
      const mockResponse = {
        items: [
          {
            messageId: 789,
            channelMessageId: 'msg-xyz',
            contactId: 456,
            channelId: 888,
            traffic: 'outgoing' as const,
            message: {
              type: 'text' as const,
              text: 'Test message',
            },
          },
        ],
        pagination: {
          next: '',
          previous: '',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.list('email:user@example.com');

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/contact/email:user@example.com/message/list',
        undefined
      );
    });

    it('should list messages with phone identifier', async () => {
      const pagination = { limit: 20 };
      const mockResponse = {
        items: [],
        pagination: {
          next: '',
          previous: '',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      await client.list('phone:+1234567890', pagination);

      expect(mockHttp.get).toHaveBeenCalledWith(
        '/contact/phone:+1234567890/message/list',
        pagination
      );
    });

    it('should list messages with cursorId only', async () => {
      const pagination = { cursorId: 200 };
      const mockResponse = {
        items: [
          {
            messageId: 123458,
            channelMessageId: 'msg-ghi',
            contactId: 123,
            channelId: 999,
            traffic: 'incoming' as const,
            message: {
              type: 'attachment' as const,
              attachment: {
                type: 'image' as const,
                url: 'https://example.com/image.jpg',
              },
            },
            sender: {
              source: 'workflow' as const,
              workflowId: 789,
            },
          },
        ],
        pagination: {
          next: '',
          previous: '',
        },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.list('id:123', pagination);

      expect(result.items[0].sender?.source).toBe('workflow');
      expect(result.items[0].sender?.workflowId).toBe(789);
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/contact/id:123/message/list',
        pagination
      );
    });
  });
});
