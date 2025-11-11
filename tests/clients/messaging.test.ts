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
  });
});
