import PlanError from './classes/PlanError';
import {
    AccountPlansData,
    AuthenticationResponseToken,
    ConnectionResponse,
    PlanId,
} from './types/AccountTypes';

const TOKEN_URL = 'https://auth.dilanxd.com/authenticate/token';
const LOGOUT_URL = 'https://auth.dilanxd.com/authenticate/logout';
const PLANS_URL = 'https://auth.dilanxd.com/plan-nu/plans';

var plans: AccountPlansData = {};

async function authLogin(
    authorizationCode?: string
): Promise<ConnectionResponse> {
    localStorage.removeItem('t');
    if (!authorizationCode) {
        let url = new URL(window.location.href);
        url.searchParams.set('state', 'view_plans');
        window.open(
            `https://auth.dilanxd.com/authenticate?redirect=${encodeURIComponent(
                url.toString()
            )}`,
            '_self'
        );
        return { success: true, data: '' };
    }

    let token = await obtainAccessToken(authorizationCode);

    if (token.error || !token.access_token) {
        return {
            success: false,
            data: token.error ?? 'No Access Token',
        };
    }
    localStorage.setItem('t', token.access_token);
    return { success: true, data: '' };
}

async function obtainAccessToken(
    authorizationCode: string
): Promise<AuthenticationResponseToken> {
    try {
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: authorizationCode }),
        });

        const data = (await response.json()) as AuthenticationResponseToken;

        return data;
    } catch (error) {
        return {
            error: 'Connection Failure',
        };
    }
}

async function authLogout(): Promise<ConnectionResponse> {
    try {
        const response = await fetch(LOGOUT_URL);
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                data: data.error,
            };
        }
        localStorage.removeItem('t');
        return { success: true, data: '' };
    } catch (error) {
        return { success: false, data: 'Connection Failure' };
    }
}

async function planOperation(
    endpoint: string,
    method: string,
    body?: object
): Promise<AccountPlansData> {
    try {
        const response = await fetch(PLANS_URL + '/' + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('t')}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (response.status === 401) {
            authLogin();
            throw new PlanError('Authorization Error');
        }

        let res = await response.json();
        if (!response.ok) {
            throw new PlanError(res.error as string);
        }

        return res as AccountPlansData;
    } catch (error) {
        throw new PlanError('Connection Failure');
    }
}

let Account = {
    isLoggedIn: () => {
        return !!localStorage.getItem('t');
    },
    login: (authorizationCode?: string) => authLogin(authorizationCode),
    logout: () => authLogout(),
    getPlans: (reload = false) => {
        if (plans && !reload) {
            return Promise.resolve(plans);
        }
        return planOperation('', 'GET');
    },
    createPlan: (name: string) => {
        return planOperation('', 'POST', { name });
    },
    deletePlan: (planId: PlanId) => {
        return planOperation(planId, 'DELETE');
    },
};

export default Account;
