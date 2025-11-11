import { ContactClient } from '../../src/clients/contact';
import { HTTPClient } from '../../src/client';
import { Contact, ContactFields } from '../../src/types';

jest.mock('../../src/client');

describe('ContactClient', () => {
  let client: ContactClient;
  let mockHttp: jest.Mocked<HTTPClient>;

  beforeEach(() => {
    mockHttp = new HTTPClient({ apiToken: 'test' }) as jest.Mocked<HTTPClient>;
    client = new ContactClient(mockHttp);
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should get contact by ID', async () => {
      const mockContact: Contact = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        created_at: 1234567890,
      };

      mockHttp.get.mockResolvedValueOnce(mockContact);

      const result = await client.get('id:123');

      expect(result).toEqual(mockContact);
      expect(mockHttp.get).toHaveBeenCalledWith('/contact/id:123');
    });

    it('should get contact by email', async () => {
      const mockContact: Contact = {
        id: 123,
        firstName: 'John',
        created_at: 1234567890,
      };

      mockHttp.get.mockResolvedValueOnce(mockContact);

      const result = await client.get('email:john@example.com');

      expect(result).toEqual(mockContact);
      expect(mockHttp.get).toHaveBeenCalledWith('/contact/email:john@example.com');
    });

    it('should get contact by phone', async () => {
      const mockContact: Contact = {
        id: 123,
        firstName: 'John',
        created_at: 1234567890,
      };

      mockHttp.get.mockResolvedValueOnce(mockContact);

      const result = await client.get('phone:+1234567890');

      expect(result).toEqual(mockContact);
      expect(mockHttp.get).toHaveBeenCalledWith('/contact/phone:+1234567890');
    });
  });

  describe('create', () => {
    it('should create contact with email identifier', async () => {
      const contactData: ContactFields = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const mockResponse = { code: '200', message: 'Contact added successfully!' };
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.create('email:john@example.com', contactData);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/email:john@example.com',
        contactData
      );
    });

    it('should create contact with phone identifier', async () => {
      const contactData: ContactFields = {
        firstName: 'John',
        phone: '+1234567890',
      };

      mockHttp.post.mockResolvedValueOnce({ code: '200', message: 'Success' });

      await client.create('phone:+1234567890', contactData);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/phone:+1234567890',
        contactData
      );
    });

    it('should create contact with custom fields', async () => {
      const contactData: ContactFields = {
        firstName: 'John',
        custom_fields: [
          { name: 'Company', value: 'Acme Inc' },
          { name: 'Role', value: 'Developer' },
        ],
      };

      mockHttp.post.mockResolvedValueOnce({ code: '200', message: 'Success' });

      await client.create('email:john@example.com', contactData);

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/email:john@example.com',
        contactData
      );
    });
  });

  describe('update', () => {
    it('should update contact', async () => {
      const updateData: Partial<ContactFields> = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockResponse = { contactId: 123 };
      mockHttp.put.mockResolvedValueOnce(mockResponse);

      const result = await client.update('id:123', updateData);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.put).toHaveBeenCalledWith('/contact/id:123', updateData);
    });

    it('should update contact custom fields', async () => {
      const updateData: Partial<ContactFields> = {
        custom_fields: [{ name: 'Status', value: 'Active' }],
      };

      mockHttp.put.mockResolvedValueOnce({ contactId: 123 });

      await client.update('id:123', updateData);

      expect(mockHttp.put).toHaveBeenCalledWith('/contact/id:123', updateData);
    });
  });

  describe('delete', () => {
    it('should delete contact', async () => {
      const mockResponse = { contactId: 123 };
      mockHttp.delete.mockResolvedValueOnce(mockResponse);

      const result = await client.delete('id:123');

      expect(result).toEqual(mockResponse);
      expect(mockHttp.delete).toHaveBeenCalledWith('/contact/id:123');
    });
  });

  describe('createOrUpdate', () => {
    it('should create or update contact', async () => {
      const contactData: ContactFields = {
        firstName: 'John',
        email: 'john@example.com',
      };

      const mockResponse = { contactId: 123 };
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.createOrUpdate('email:john@example.com', contactData);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/create_or_update/email:john@example.com',
        contactData
      );
    });
  });

  describe('merge', () => {
    it('should merge two contacts', async () => {
      const mergeRequest = {
        contactIds: [123, 456] as [number, number],
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse = { contactId: 123 };
      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.merge(mergeRequest);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/merge', mergeRequest);
    });
  });

  describe('list', () => {
    it('should list all contacts', async () => {
      const filter = {
        search: '',
        timezone: 'UTC',
        filter: { $and: [] },
      };

      const mockResponse = {
        items: [
          { id: 1, firstName: 'John', created_at: 1234567890 },
          { id: 2, firstName: 'Jane', created_at: 1234567891 },
        ],
        pagination: {
          next: 'https://api.respond.io/contact/list?limit=10&cursorId=10',
          previous: 'https://api.respond.io/contact/list?limit=10&cursorId=-10',
        },
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.list(filter);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/list', filter, undefined);
    });

    it('should list contacts with pagination', async () => {
      const filter = {
        search: '',
        timezone: 'UTC',
        filter: { $and: [] },
      };

      const pagination = { limit: 50, cursorId: 100 };

      mockHttp.post.mockResolvedValueOnce({
        items: [],
        pagination: { next: '', previous: '' },
      });

      await client.list(filter, pagination);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/list', filter, pagination);
    });

    it('should list contacts with filters', async () => {
      const filter = {
        search: '',
        timezone: 'America/New_York',
        filter: {
          $and: [
            {
              category: 'contactField' as const,
              field: 'assigneeUserId',
              operator: 'isEqualTo' as const,
              value: '123',
            },
          ],
        },
      };

      mockHttp.post.mockResolvedValueOnce({
        items: [],
        pagination: { next: '', previous: '' },
      });

      await client.list(filter);

      expect(mockHttp.post).toHaveBeenCalledWith('/contact/list', filter, undefined);
    });
  });

  describe('addTags', () => {
    it('should add tags to contact', async () => {
      const tags = ['vip', 'premium'];
      const mockResponse = { contactId: 123 };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.addTags('id:123', tags);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/contact/id:123/tag', tags);
    });
  });

  describe('deleteTags', () => {
    it('should delete tags from contact', async () => {
      const tags = ['old-tag'];
      const mockResponse = { contactId: 123 };

      mockHttp.delete.mockResolvedValueOnce(mockResponse);

      const result = await client.deleteTags('id:123', tags);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.delete).toHaveBeenCalledWith('/contact/id:123/tag', tags);
    });
  });

  describe('listChannels', () => {
    it('should list contact channels', async () => {
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

      const result = await client.listChannels('id:123');

      expect(result).toEqual(mockResponse);
      expect(mockHttp.get).toHaveBeenCalledWith('/contact/id:123/channels', undefined);
    });

    it('should list channels with pagination', async () => {
      const pagination = { limit: 20, cursorId: 5 };

      mockHttp.get.mockResolvedValueOnce({
        items: [],
        pagination: { next: '', previous: '' },
      });

      await client.listChannels('id:123', pagination);

      expect(mockHttp.get).toHaveBeenCalledWith('/contact/id:123/channels', pagination);
    });
  });

  describe('updateLifecycle', () => {
    it('should update contact lifecycle', async () => {
      const request = { name: 'Hot Lead' };
      const mockResponse = { code: 200, message: 'Success' };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.updateLifecycle('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/lifecycle/update',
        request
      );
    });

    it('should remove contact lifecycle', async () => {
      const request = { name: null };
      const mockResponse = { code: 200, message: 'Success' };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const result = await client.updateLifecycle('id:123', request);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/contact/id:123/lifecycle/update',
        request
      );
    });
  });
});
