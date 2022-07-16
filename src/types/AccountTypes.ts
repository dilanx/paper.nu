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
    activatePlan: (planId: string) => void;
    deactivatePlan: () => void;
    deletePlan: (planId: string, planName: string) => void;
}
