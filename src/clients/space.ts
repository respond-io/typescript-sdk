import { HTTPClient } from '../client';
import {
  SpaceUser,
  CustomField,
  CreateCustomFieldRequest,
  ClosingNote,
  SpaceChannel,
  WhatsAppTemplate,
  SpaceTag,
  CreateSpaceTagRequest,
  UpdateSpaceTagRequest,
  DeleteSpaceTagRequest,
  PaginationParams,
  PaginationResponse,
} from '../types/index';

/**
 * Space API client for workspace-level operations
 */
export class SpaceClient {
  constructor(private readonly http: HTTPClient) {}

  /**
   * List users in the workspace
   * @param pagination - Pagination parameters
   */
  async listUsers(
    pagination?: PaginationParams
  ): Promise<{ items: SpaceUser[]; pagination: PaginationResponse }> {
    return this.http.get('/space/user', pagination);
  }

  /**
   * Get a user by ID
   * @param id - User ID
   */
  async getUser(id: number): Promise<SpaceUser> {
    return this.http.get(`/space/user/${id}`);
  }

  /**
   * Create a custom field
   * @param request - Custom field creation request
   */
  async createCustomField(request: CreateCustomFieldRequest): Promise<CustomField> {
    return this.http.post('/space/custom_field', request);
  }

  /**
   * List all custom fields
   * @param pagination - Pagination parameters
   */
  async listCustomFields(
    pagination?: PaginationParams
  ): Promise<{ items: CustomField[]; pagination: PaginationResponse }> {
    return this.http.get('/space/custom_field', pagination);
  }

  /**
   * Get a custom field by ID
   * @param id - Custom field ID
   */
  async getCustomField(id: number): Promise<CustomField> {
    return this.http.get(`/space/custom_field/${id}`);
  }

  /**
   * List closing notes
   * @param pagination - Pagination parameters
   */
  async listClosingNotes(
    pagination?: PaginationParams
  ): Promise<{ items: ClosingNote[]; pagination: PaginationResponse }> {
    return this.http.get('/space/closing_notes', pagination);
  }

  /**
   * List all channels in the workspace
   * @param pagination - Pagination parameters
   */
  async listChannels(
    pagination?: PaginationParams
  ): Promise<{ items: SpaceChannel[]; pagination: PaginationResponse }> {
    return this.http.get('/space/channel', pagination);
  }

  /**
   * List message templates for a channel
   * @param channelId - Channel ID
   * @param pagination - Pagination parameters
   */
  async listTemplates(
    channelId: number,
    pagination?: PaginationParams
  ): Promise<{ items: WhatsAppTemplate[]; pagination: PaginationResponse }> {
    return this.http.get(`/space/channel/${channelId}/template`, pagination);
  }

  /**
   * Create a workspace tag
   * @param request - Tag creation request
   */
  async createTag(request: CreateSpaceTagRequest): Promise<SpaceTag> {
    return this.http.post('/space/tag', request);
  }

  /**
   * Update a workspace tag
   * @param request - Tag update request
   */
  async updateTag(request: UpdateSpaceTagRequest): Promise<SpaceTag> {
    return this.http.put('/space/tag', request);
  }

  /**
   * Delete a workspace tag
   * @param request - Tag deletion request
   */
  async deleteTag(
    request: DeleteSpaceTagRequest
  ): Promise<{ code: number; message: string }> {
    return this.http.delete('/space/tag', request);
  }
}
