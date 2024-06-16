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

export interface OperationOptions {
  body?: object;
  useAuth?: boolean;
  autoAuth?: boolean;
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

export interface SharePostResponse {
  success: boolean;
  reuse: boolean;
  shortCode: string;
  document?: Document;
}

export interface Document {
  id: string;
  name: string;
  createdAt: number;
  data?: SerializedPlanData | SerializedScheduleData;
  lastUpdated?: number;
  notes?: string;
  public?: boolean;
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
  erase: (id: string, name: string) => void;
}

export interface UserInformation {
  firstName: string;
  lastName: string;
  email: string;
  color: string;
}

export interface RecentShareOwner {
  firstName?: string;
  lastName?: string;
  color?: string;
}

export interface RecentShareItem {
  shortCode: string;
  type: 1 | 2;
  name: string;
  owner?: RecentShareOwner;
  termId?: string;
}

export interface RecentShareModificationFunctions {
  open: (shortCode: string) => void;
  remove: (shortCode: string) => void;
}
