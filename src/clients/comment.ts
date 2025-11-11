import { HTTPClient } from '../client';
import {
  ContactIdentifier,
  CreateCommentRequest,
  CreateCommentResponse,
} from '../types/index';

/**
 * Comment API client
 */
export class CommentClient {
  constructor(private readonly http: HTTPClient) {}

  /**
   * Create a comment on a contact
   * @param identifier - Contact identifier
   * @param request - Comment request
   */
  async create(
    identifier: ContactIdentifier,
    request: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    return this.http.post(`/contact/${identifier}/comment`, request);
  }
}
