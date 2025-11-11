/**
 * Comment-related types
 */

/**
 * Create comment request
 */
export interface CreateCommentRequest {
  text: string;
}

/**
 * Create comment response
 */
export interface CreateCommentResponse {
  contactId: number;
  text: string;
  created_at: number;
}
