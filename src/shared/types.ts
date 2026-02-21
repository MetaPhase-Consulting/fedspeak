export type AcronymCategory =
  | 'department'
  | 'agency'
  | 'office'
  | 'bureau'
  | 'program'
  | 'process'
  | 'regulation'
  | 'system'
  | 'general';

export interface AcronymEntry {
  full: string;
  description: string;
  agency: string;
  category: AcronymCategory;
  url?: string;
  aliases?: string[];
}

export interface AcronymData {
  [key: string]: AcronymEntry;
}

export interface DecodedResult {
  acronym: string;
  full: string;
  description: string;
  agency: string;
  category: AcronymCategory;
  url?: string;
}

export interface DecodeResponse {
  success: boolean;
  query: string;
  mode: 'single' | 'scan';
  results: DecodedResult[];
  count: number;
  truncated: boolean;
}

export interface DecodeRequest {
  acronym?: string;
  text?: string;
}
