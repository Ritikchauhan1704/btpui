import {UUID} from 'crypto';

export interface User {
  id: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  slack: boolean;
  gmail: boolean;
  gdrive: boolean;
  onboarded: boolean;
}

export enum DocumentSource {
  SLACK = 'slack',
  GMAIL = 'gmail',
  GOOGLE_DRIVE = 'google drive',
}

export interface BasicExpertInfo {
  display_name: string;
  email: string;
  photo_link?: string;
}

export interface Thread {
  photo_link?: string;
  sender: string;
  time_stamp: string;
  message: string;
}

export interface ThreadsInfo {
  unread_messages: number;
  thread_message_count: number;
  thread_messages: Thread[] | null;
}

export interface SearchResult {
  semantic_identifier: string;
  link: string;
  source: DocumentSource;
  snippet: string;
  doc_updated_at: string;
  primary_owner: BasicExpertInfo;
  unsupported_file: boolean;
  // is_thread: boolean;
  // threads? : ThreadsInfo;
}

export interface Citation {
  semantic_identifier: string;
  link: string;
  source: DocumentSource;
}

export interface SearchResponse {
  id: number | null;
  answer: string;
  search_results: SearchResult[] | null;
  citations: Citation[] | null;
}

export interface TeammateTypeOut {
  id: UUID;
  name: string;
  short_description: string;
  image_url: string;
  created_by: string;
  date_created: string;
  howThisWorks: string[];
  whatYouNeed: string[];
}
export interface TeammateOut {
  id: UUID;
  name: string;
  access_type: 'personal' | 'organisation';
  short_description: string;
  image_url: string;
  teammate_form_factors: TeammateFormFactors[];
  created_by: string;
  date_created: string;
  howThisWorks: string[];
  whatYouNeed: string[];
}

export interface TeammateFormFactors {
  id: UUID;
  form_factor: 'zelo' | 'slack' | 'whatsapp';
}

export interface Message {
  content: string;
  role: 'user' | 'zelo';
  bot: string;
}
