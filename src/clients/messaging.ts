import { HTTPClient } from '../client';
import {
  ContactIdentifier,
  SendMessageRequest,
  SendMessageResponse,
  GetMessageResponse,
} from '../types/index';

/**
 * Messaging API client
 */
export class MessagingClient {
  constructor(private readonly http: HTTPClient) {}

  /**
   * Send a message to a contact
   * @param identifier - Contact identifier
   * @param request - Message request
   */
  async send(
    identifier: ContactIdentifier,
    request: SendMessageRequest
  ): Promise<SendMessageResponse> {
    return this.http.post(`/contact/${identifier}/message`, request);
  }

  /**
   * Get a message by ID
   * @param identifier - Contact identifier
   * @param messageId - Message ID
   */
  async get(
    identifier: ContactIdentifier,
    messageId: number
  ): Promise<GetMessageResponse> {
    return this.http.get(`/contact/${identifier}/message/${messageId}`);
  }
}
