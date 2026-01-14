/**
 * Message-related types
 */

/**
 * Message traffic direction
 */
export type MessageTraffic = 'outgoing' | 'incoming';

/**
 * Message status value
 */
export type MessageStatusValue = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Message status entry
 */
export interface MessageStatusEntry {
  value: MessageStatusValue;
  timestamp: number;
  message?: string;
}

/**
 * Text message
 */
export interface TextMessage {
  type: 'text';
  text: string;
  messageTag?: 'ACCOUNT_UPDATE' | 'POST_PURCHASE_UPDATE' | 'CONFIRMED_EVENT_UPDATE';
}

/**
 * Attachment types
 */
export type AttachmentType = 'image' | 'video' | 'audio' | 'file';

/**
 * Attachment message
 */
export interface AttachmentMessage {
  type: 'attachment';
  attachment: {
    type: AttachmentType;
    url: string;
  };
}

/**
 * Custom payload message
 */
export interface CustomPayloadMessage {
  type: 'custom_payload';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
}

/**
 * Quick reply message
 */
export interface QuickReplyMessage {
  type: 'quick_reply';
  title: string;
  replies: string[];
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  type: AttachmentType;
  url: string;
  fileName: string;
}

/**
 * Email message
 */
export interface EmailMessage {
  type: 'email';
  text: string;
  subject?: string;
  bcc?: string[];
  cc?: string[];
  replyToMessageId?: number;
  attachments?: EmailAttachment[];
}

/**
 * WhatsApp template parameter
 */
export interface TemplateParameter {
  type: 'text' | 'image' | 'video' | 'document' | 'location';
  text?: string;
  image?: {
    link: string;
    caption?: string;
    filename?: string;
  };
  video?: {
    link: string;
    caption?: string;
    filename?: string;
  };
  document?: {
    link: string;
    caption?: string;
    filename: string;
  };
  location?: {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
  };
}

/**
 * WhatsApp template button types
 */
export type TemplateButtonType =
  | 'quick_reply'
  | 'phone_number'
  | 'url'
  | 'catalog'
  | 'mpm';

/**
 * WhatsApp template button
 */
export interface TemplateButton {
  type: TemplateButtonType;
  text?: string;
  phone_number?: string;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: TemplateParameter[] | { type: 'action'; action: Record<string, any> }[];
}

/**
 * WhatsApp template component
 */
export interface TemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons';
  format?: 'text' | 'image' | 'video' | 'document' | 'location';
  text?: string;
  parameters?: TemplateParameter[];
  buttons?: TemplateButton[];
}

/**
 * WhatsApp template message
 */
export interface WhatsAppTemplateMessage {
  type: 'whatsapp_template';
  template: {
    name: string;
    languageCode: string;
    components?: TemplateComponent[];
  };
}

/**
 * All message types
 */
export type Message =
  | TextMessage
  | AttachmentMessage
  | CustomPayloadMessage
  | QuickReplyMessage
  | EmailMessage
  | WhatsAppTemplateMessage;

/**
 * Send message request
 */
export interface SendMessageRequest {
  channelId?: number | null;
  message: Message;
}

/**
 * Send message response
 */
export interface SendMessageResponse {
  messageId: number;
}

/**
 * Message sender
 */
export interface MessageSender {
  source: 'user' | 'ai_agent' | 'workflow' | 'api' | 'echo' | 'broadcast';
  userId?: number;
  teamId?: number;
  workflowId?: number;
  broadcastHistoryId?: number;
}

/**
 * Get message response
 */
export interface GetMessageResponse {
  messageId: number;
  channelMessageId: string | number;
  contactId: number;
  channelId: number;
  traffic: MessageTraffic;
  message: Message;
  status?: MessageStatusEntry[];
  sender?: MessageSender;
}
