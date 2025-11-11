import { CommentClient } from '../../src/clients/comment';
import { ConversationClient } from '../../src/clients/conversation';
import { SpaceClient } from '../../src/clients/space';
import { HTTPClient } from '../../src/client';

jest.mock('../../src/client');

describe('CommentClient', () => {
  let client: CommentClient;
  let mockHttp: jest.Mocked<HTTPClient>;

  beforeEach(() => {
    mockHttp = new HTTPClient({ apiToken: 'test' }) as jest.Mocked<HTTPClient>;
    client = new CommentClient(mockHttp);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const request = { text: 'This is a comment' };
      const mockResponse = {
        contactId: 123,
        text: 'This is a comment',
        created_at: 1234567890,
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.create('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/comment', request);
    });

    it('should create comment with user mention', async () => {
      const request = { text: 'Please follow up {{@user.456}}' };
      const mockResponse = {
        contactId: 123,
        text: request.text,
        created_at: 1234567890,
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.create('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/comment', request);
    });
  });
});

describe('ConversationClient', () => {
  let client: ConversationClient;
  let mockHttp: jest.Mocked<HTTPClient>;

  beforeEach(() => {
    mockHttp = new HTTPClient({ apiToken: 'test' }) as jest.Mocked<HTTPClient>;
    client = new ConversationClient(mockHttp);
    jest.clearAllMocks();
  });

  describe('assign', () => {
    it('should assign conversation by user ID', async () => {
      const request = { assignee: 456 };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.assign('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/assignee',
        request
      );
    });

    it('should assign conversation by email', async () => {
      const request = { assignee: 'agent@example.com' };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      await client.assign('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/assignee',
        request
      );
    });

    it('should unassign conversation', async () => {
      const request = { assignee: null };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      await client.assign('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/assignee',
        request
      );
    });
  });

  describe('updateStatus', () => {
    it('should open conversation', async () => {
      const request = { status: 'open' as const };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.updateStatus('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/status',
        request
      );
    });

    it('should close conversation with notes', async () => {
      const request = {
        status: 'close' as const,
        category: 'Resolved',
        summary: 'Issue resolved successfully',
      };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      await client.updateStatus('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/status',
        request
      );
    });

    it('should close conversation without notes', async () => {
      const request = { status: 'close' as const };
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      await client.updateStatus('id:123', request);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/conversation/status',
        request
      );
    });
  });
});

describe('SpaceClient', () => {
  let client: SpaceClient;
  let mockHttp: jest.Mocked<HTTPClient>;

  beforeEach(() => {
    mockHttp = new HTTPClient({ apiToken: 'test' }) as jest.Mocked<HTTPClient>;
    client = new SpaceClient(mockHttp);
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should list users', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'agent' as const,
            team: null,
            restrictions: [],
          },
        ],
        pagination: { next: '', previous: '' },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.listUsers();

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/user', undefined);
    });

    it('should list users with pagination', async () => {
      mockHttp.get.mockResolvedValueOnce({
        items: [],
        pagination: { next: '', previous: '' },
      });

      await client.listUsers({ limit: 50, cursorId: 10 });

      expect(mockHttp.get).toHaveBeenCalledWith('/space/user', {
        limit: 50,
        cursorId: 10,
      });
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      const mockUser = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'manager' as const,
        team: { id: 1, name: 'Support' },
        restrictions: [],
      };

      mockHttp.get.mockResolvedValueOnce(mockUser);

      const result = await client.getUser(123);

      expect(result).toEqual(mockUser);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/user/123');
    });
  });

  describe('createCustomField', () => {
    it('should create text custom field', async () => {
      const request = {
        name: 'Customer ID',
        slug: 'customer_id',
        description: 'Unique identifier',
        dataType: 'text' as const,
      };

      const mockResponse = {
        id: 1,
        name: 'Customer ID',
        description: 'Unique identifier',
        dataType: 'text' as const,
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.createCustomField(request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/space/custom_field', request);
    });

    it('should create list custom field', async () => {
      const request = {
        name: 'Priority',
        dataType: 'list' as const,
        allowedValues: ['Low', 'Medium', 'High'],
      };

      mockHttp.post.mockResolvedValueOnce({
        id: 1,
        name: 'Priority',
        description: '',
        dataType: 'list' as const,
        allowedValues: ['Low', 'Medium', 'High'],
      });

      await client.createCustomField(request);

      expect(mockHttp.post).toHaveBeenCalledWith('/space/custom_field', request);
    });
  });

  describe('listCustomFields', () => {
    it('should list custom fields', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            name: 'Customer ID',
            description: 'ID',
            dataType: 'text' as const,
          },
        ],
        pagination: { next: '', previous: '' },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.listCustomFields();

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/custom_field', undefined);
    });
  });

  describe('getCustomField', () => {
    it('should get custom field by ID', async () => {
      const mockField = {
        id: 123,
        name: 'Field Name',
        description: 'Description',
        dataType: 'number' as const,
      };

      mockHttp.get.mockResolvedValueOnce(mockField);

      const result = await client.getCustomField(123);

      expect(result).toEqual(mockField);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/custom_field/123');
    });
  });

  describe('listClosingNotes', () => {
    it('should list closing notes', async () => {
      const mockResponse = {
        items: [
          {
            category: 'Resolved',
            description: 'Issue resolved',
          },
        ],
        pagination: { next: '', previous: '' },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.listClosingNotes();

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/closing_notes', undefined);
    });
  });

  describe('listChannels', () => {
    it('should list channels', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            name: 'WhatsApp',
            source: 'whatsapp' as const,
            created_at: 1234567890,
          },
        ],
        pagination: { next: '', previous: '' },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.listChannels();

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/channel', undefined);
    });
  });

  describe('listTemplates', () => {
    it('should list templates for channel', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            name: 'welcome_template',
            components: [],
            channelId: 123,
            botId: 456,
            languageCode: 'en',
            category: 'MARKETING',
          },
        ],
        pagination: { next: '', previous: '' },
      };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await client.listTemplates(123);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/space/channel/123/template', undefined);
    });
  });

  describe('Tag operations', () => {
    it('should create tag', async () => {
      const request = {
        name: 'VIP',
        description: 'VIP customers',
        colorCode: '#FF0000',
        emoji: '⭐',
      };

      const mockResponse = {
        id: 1,
        name: 'VIP',
        description: 'VIP customers',
        colorCode: '#FF0000',
        emoji: '⭐',
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.createTag(request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/space/tag', request);
    });

    it('should update tag', async () => {
      const request = {
        currentName: 'VIP',
        name: 'Premium',
        colorCode: '#FFD700',
      };

      const mockResponse = {
        id: 1,
        name: 'Premium',
        colorCode: '#FFD700',
      };

      mockHttp.put.mockResolvedValueOnce(mockResponse);

      const result = await client.updateTag(request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.put).toHaveBeenCalledWith('/space/tag', request);
    });

    it('should delete tag', async () => {
      const request = { name: 'Old Tag' };
      const mockResponse = { code: 200, message: 'Tag deleted successfully' };

      mockHttp.delete.mockResolvedValueOnce(mockResponse);

      const result = await client.deleteTag(request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.delete).toHaveBeenCalledWith('/space/tag', request);
    });
  });
});
