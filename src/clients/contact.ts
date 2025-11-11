import { HTTPClient } from '../client';
import {
  Contact,
  ContactFields,
  ContactIdentifier,
  ContactActionResponse,
  ContactFilter,
  PaginationParams,
  PaginationResponse,
  MergeContactsRequest,
  ContactChannel,
  UpdateContactLifecycleRequest,
} from '../types/index';

/**
 * Contact API client
 */
export class ContactClient {
  constructor(private readonly http: HTTPClient) {}

  /**
   * Get a contact by identifier
   * @param identifier - Contact identifier (id:123, email:user@example.com, phone:+1234567890)
   */
  async get(identifier: ContactIdentifier): Promise<Contact> {
    return this.http.get<Contact>(`/contact/${identifier}`);
  }

  /**
   * Create a new contact
   * @param identifier - Contact identifier (email:user@example.com or phone:+1234567890)
   * @param data - Contact data
   */
  async create(
    identifier: Exclude<ContactIdentifier, `id:${number}`>,
    data: ContactFields
  ): Promise<{ code: string; message: string }> {
    return this.http.post(`/contact/${identifier}`, data);
  }

  /**
   * Update an existing contact
   * @param identifier - Contact identifier
   * @param data - Partial contact data to update
   */
  async update(
    identifier: ContactIdentifier,
    data: Partial<ContactFields>
  ): Promise<ContactActionResponse> {
    return this.http.put(`/contact/${identifier}`, data);
  }

  /**
   * Delete a contact
   * @param identifier - Contact identifier
   */
  async delete(identifier: ContactIdentifier): Promise<ContactActionResponse> {
    return this.http.delete(`/contact/${identifier}`);
  }

  /**
   * Create or update a contact
   * @param identifier - Contact identifier
   * @param data - Contact data
   */
  async createOrUpdate(
    identifier: ContactIdentifier,
    data: ContactFields
  ): Promise<ContactActionResponse> {
    return this.http.post(`/contact/create_or_update/${identifier}`, data);
  }

  /**
   * Merge two contacts
   * @param request - Merge request with contact IDs and optional field updates
   */
  async merge(request: MergeContactsRequest): Promise<ContactActionResponse> {
    return this.http.post('/contact/merge', request);
  }

  /**
   * List contacts with optional filters
   * @param filter - Filter criteria
   * @param pagination - Pagination parameters
   */
  async list(
    filter: ContactFilter,
    pagination?: PaginationParams
  ): Promise<{ items: Contact[]; pagination: PaginationResponse }> {
    return this.http.post('/contact/list', filter, pagination);
  }

  /**
   * Add tags to a contact
   * @param identifier - Contact identifier
   * @param tags - Array of tag names (1-10 tags, max 255 chars each)
   */
  async addTags(
    identifier: ContactIdentifier,
    tags: string[]
  ): Promise<ContactActionResponse> {
    return this.http.post(`/contact/${identifier}/tag`, tags);
  }

  /**
   * Remove tags from a contact
   * @param identifier - Contact identifier
   * @param tags - Array of tag names to remove
   */
  async deleteTags(
    identifier: ContactIdentifier,
    tags: string[]
  ): Promise<ContactActionResponse> {
    return this.http.delete(`/contact/${identifier}/tag`, tags);
  }

  /**
   * List all channels connected to a contact
   * @param identifier - Contact identifier
   * @param pagination - Pagination parameters
   */
  async listChannels(
    identifier: ContactIdentifier,
    pagination?: PaginationParams
  ): Promise<{ items: ContactChannel[]; pagination: PaginationResponse }> {
    return this.http.get(`/contact/${identifier}/channels`, pagination);
  }

  /**
   * Update contact lifecycle stage
   * @param identifier - Contact identifier
   * @param request - Lifecycle update request (null to remove lifecycle)
   */
  async updateLifecycle(
    identifier: ContactIdentifier,
    request: UpdateContactLifecycleRequest
  ): Promise<{ code: number; message: string }> {
    return this.http.post(`/contact/${identifier}/lifecycle/update`, request);
  }
}
