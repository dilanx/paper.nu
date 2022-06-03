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

export type PlanId = string;

export interface AccountPlansData {
    [key: PlanId]: AccountPlanData;
}

export interface AccountPlanData {
    name: string;
    createdAt: number;
    content?: string;
    lastUpdated?: number;
}

export interface AccountModificationFunctions {
    activatePlan: (planId: PlanId) => void;
    deletePlan: (planId: PlanId, planName: string) => void;
}
