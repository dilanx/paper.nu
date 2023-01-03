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

export interface AccountDataMap {
  [key: string]: AccountData;
}

export interface AccountData {
  name: string;
  createdAt: number;
  content: string;
  lastUpdated?: number;
}

export interface AccountModificationFunctions {
  activate: (id: string) => void;
  deactivate: () => void;
  rename: (id: string, name: string) => void;
  delete: (id: string, name: string) => void;
}

export interface UserInformation {
  name: string;
  email: string;
  color: string;
}
