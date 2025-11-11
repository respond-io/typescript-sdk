import { HTTPClient, RespondIOConfig } from './client';
import {
  ContactClient,
  MessagingClient,
  CommentClient,
  ConversationClient,
  SpaceClient,
} from './clients/index';

/**
 * Main RespondIO SDK client
 *
 * @example
 * ```typescript
 * import { RespondIO } from '@respond-io/typescript-sdk';
 *
 * const client = new RespondIO({
 *   apiToken: 'your-api-token',
 * });
 *
 * // Get a contact
 * const contact = await client.contacts.get('id:123');
 *
 * // Send a message
 * await client.messaging.send('id:123', {
 *   message: {
 *     type: 'text',
 *     text: 'Hello!',
 *   },
 * });
 * ```
 */
export class RespondIO {
  private readonly http: HTTPClient;

  /** Contact management operations */
  public readonly contacts: ContactClient;

  /** Messaging operations */
  public readonly messaging: MessagingClient;

  /** Comment operations */
  public readonly comments: CommentClient;

  /** Conversation management operations */
  public readonly conversations: ConversationClient;

  /** Workspace-level operations */
  public readonly space: SpaceClient;

  /**
   * Create a new RespondIO SDK client
   * @param config - SDK configuration
   */
  constructor(config: RespondIOConfig) {
    if (!config.apiToken) {
      throw new Error('API token is required');
    }

    this.http = new HTTPClient(config);
    this.contacts = new ContactClient(this.http);
    this.messaging = new MessagingClient(this.http);
    this.comments = new CommentClient(this.http);
    this.conversations = new ConversationClient(this.http);
    this.space = new SpaceClient(this.http);
  }
}

// Export all types and classes
export * from './types/index';
export * from './client';
export * from './clients/index';
export * from './errors/index';

// Default export
export default RespondIO;
