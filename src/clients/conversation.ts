import { HTTPClient } from '../client';
import {
  ContactIdentifier,
  ContactActionResponse,
  AssignConversationRequest,
  ConversationStatusRequest,
} from '../types/index';

/**
 * Conversation API client
 */
export class ConversationClient {
  constructor(private readonly http: HTTPClient) {}

  /**
   * Assign or unassign a conversation
   * @param identifier - Contact identifier
   * @param request - Assignment request (null to unassign)
   */
  async assign(
    identifier: ContactIdentifier,
    request: AssignConversationRequest
  ): Promise<ContactActionResponse> {
    return this.http.post(`/contact/${identifier}/conversation/assignee`, request);
  }

  /**
   * Open or close a conversation
   * @param identifier - Contact identifier
   * @param request - Status update request
   */
  async updateStatus(
    identifier: ContactIdentifier,
    request: ConversationStatusRequest
  ): Promise<ContactActionResponse> {
    return this.http.post(`/contact/${identifier}/conversation/status`, request);
  }
}
