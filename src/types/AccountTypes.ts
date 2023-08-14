import { SerializedPlanData } from './PlanTypes';
import { SerializedScheduleData } from './ScheduleTypes';

/**
 * Invariant for now:
 * - If `success` is true, `data` can be anything
 * - If `success` is false, `data` should be an error string
 */
export interface ConnectionResponse {
  success: boolean;
  data: object | string;
}

export interface AuthenticationResponseToken {
  access_token?: string;
  error?: string;
}

export interface GetResponse {
  success: boolean;
  documents: Document[];
}

export interface CreateResponse {
  success: boolean;
  document: Document;
}

export interface UpdateResponse {
  success: boolean;
  document: Document;
}

export interface DeleteResponse {
  success: boolean;
  id: string;
}

export interface Document {
  id: string;
  name: string;
  createdAt: number;
  data?: SerializedPlanData | SerializedScheduleData;
  lastUpdated?: number;
  notes?: string;
}

export interface DocumentCache {
  user?: UserInformation;
  plans?: Document[];
  schedules?: Document[];
}

export type DocumentType = 'plans' | 'schedules';

export interface AccountModificationFunctions {
  activate: (id: string) => void;
  deactivate: () => void;
  rename: (id: string, name: string) => void;
  duplicate: (document: Document) => void;
  delete: (id: string, name: string) => void;
}

export interface UserInformation {
  firstName: string;
  lastName: string;
  email: string;
  color: string;
}
