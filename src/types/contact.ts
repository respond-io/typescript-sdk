/**
 * Contact-related types
 */

/**
 * Custom field value for contact
 */
export interface CustomFieldValue {
  name: string;
  value: string | number | boolean | null;
}

/**
 * User (assignee)
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Conversation status
 */
export type ConversationStatus = 'open' | 'close';

/**
 * Contact
 */
export interface Contact {
  id: number;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  language?: string | null;
  profilePic?: string | null;
  countryCode?: string | null;
  custom_fields?: CustomFieldValue[] | null;
  status?: ConversationStatus;
  tags?: string[];
  assignee?: User | null;
  lifecycle?: string | null;
  created_at: number;
}

/**
 * Contact creation/update fields
 */
export interface ContactFields {
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  language?: string | null;
  profilePic?: string | null;
  countryCode?: string | null;
  custom_fields?: CustomFieldValue[] | null;
}

/**
 * Contact filter operators
 */
export type FilterOperator =
  | 'isEqualTo'
  | 'isNotEqualTo'
  | 'isTimestampAfter'
  | 'isTimestampBefore'
  | 'isTimestampBetween'
  | 'exists'
  | 'doesNotExist'
  | 'isGreaterThan'
  | 'isLessThan'
  | 'isBetween'
  | 'hasAnyOf'
  | 'hasAllOf'
  | 'hasNoneOf';

/**
 * Contact filter category
 */
export type FilterCategory = 'contactField' | 'contactTag' | 'lifecycle';

/**
 * Contact filter condition
 */
export interface FilterCondition {
  category: FilterCategory;
  field: string | null;
  operator: FilterOperator;
  value: string | string[] | { from: string; to: string } | null;
}

/**
 * Contact filter
 */
export interface ContactFilter {
  search?: string;
  timezone: string;
  filter: {
    $and?: FilterCondition[];
    $or?: FilterCondition[];
  };
}

/**
 * Update contact lifecycle request
 */
export interface UpdateContactLifecycleRequest {
  name: string | null;
}

/**
 * Merge contacts request
 */
export interface MergeContactsRequest extends Partial<ContactFields> {
  contactIds: [number, number];
}

/**
 * Channel sources
 */
export type ChannelSource =
  | 'facebook'
  | 'instagram'
  | 'line'
  | 'telegram'
  | 'viber'
  | 'twitter'
  | 'wechat'
  | 'custom_channel'
  | 'gmail'
  | 'other_email'
  | 'twilio'
  | 'message_bird'
  | 'nexmo'
  | '360dialog_whatsapp'
  | 'twilio_whatsapp'
  | 'message_bird_whatsapp'
  | 'whatsapp'
  | 'nexmo_whatsapp'
  | 'whatsapp_cloud';

/**
 * Contact channel
 */
export interface ContactChannel {
  id: number;
  name: string;
  source: ChannelSource;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
  lastMessageTime?: number;
  lastIncomingMessageTime?: number;
  created_at: number;
}
