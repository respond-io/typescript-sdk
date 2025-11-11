/**
 * Space (workspace) related types
 */

import { ChannelSource } from './contact';
import { TemplateComponent } from './message';

/**
 * User roles in workspace
 */
export type UserRole = 'agent' | 'manager' | 'owner';

/**
 * User restrictions
 */
export type UserRestriction =
  | 'restrict_data_export'
  | 'restrict_contact_deletion'
  | 'restrict_space_setting'
  | 'show_team_contacts'
  | 'show_only_mine'
  | 'restrict_space_integration'
  | 'restrict_shortcuts';

/**
 * Team information
 */
export interface Team {
  id: number;
  name: string;
}

/**
 * Space user
 */
export interface SpaceUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  team: Team | null;
  restrictions: UserRestriction[];
}

/**
 * Custom field data types
 */
export type CustomFieldDataType =
  | 'text'
  | 'list'
  | 'checkbox'
  | 'email'
  | 'number'
  | 'url'
  | 'date'
  | 'time';

/**
 * Custom field definition
 */
export interface CustomField {
  id: number;
  name: string;
  description: string;
  dataType: CustomFieldDataType;
  allowedValues?: string[];
}

/**
 * Create custom field request
 */
export interface CreateCustomFieldRequest {
  name: string;
  slug?: string | null;
  description?: string;
  dataType: CustomFieldDataType;
  allowedValues?: string[] | null;
}

/**
 * Closing note
 */
export interface ClosingNote {
  category: string;
  description: string;
}

/**
 * Space channel
 */
export interface SpaceChannel {
  id: number;
  name: string;
  source: ChannelSource;
  created_at: number;
}

/**
 * WhatsApp template definition (from space API)
 */
export interface WhatsAppTemplate {
  id: number;
  name: string;
  components: TemplateComponent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bundle?: Record<string, any>;
  channelId: number;
  botId: number;
  languageCode: string;
  namespace?: string | null;
  category: string;
  status?: string;
  statusDetail?: string;
}

/**
 * Space tag
 */
export interface SpaceTag {
  id: number;
  name: string;
  description?: string;
  emoji?: string;
  colorCode?: string;
}

/**
 * Create space tag request
 */
export interface CreateSpaceTagRequest {
  name: string;
  description?: string;
  colorCode?: string;
  emoji?: string;
}

/**
 * Update space tag request
 */
export interface UpdateSpaceTagRequest {
  currentName: string;
  name?: string;
  description?: string;
  colorCode?: string;
  emoji?: string;
}

/**
 * Delete space tag request
 */
export interface DeleteSpaceTagRequest {
  name: string;
}
