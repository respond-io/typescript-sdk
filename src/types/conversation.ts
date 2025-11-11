/**
 * Conversation-related types
 */

import { ConversationStatus } from './contact';

/**
 * Assign/unassign conversation request
 */
export interface AssignConversationRequest {
  assignee: string | number | null;
}

/**
 * Open/close conversation request
 */
export interface ConversationStatusRequest {
  status: ConversationStatus;
  category?: string;
  summary?: string;
}
