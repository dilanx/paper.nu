import PlanError from './classes/PlanError';
import {
    AccountPlansData,
    AuthenticationResponseToken,
    ConnectionResponse,
} from './types/AccountTypes';
import Utility from './Utility';

const TOKEN_URL = 'https://auth.dilanxd.com/authenticate/token';
const PLANS_URL = 'https://auth.dilanxd.com/plan-nu/plans';

var plans: AccountPlansData | undefined = undefined;

async function authLogin(
    authorizationCode?: string,
    state?: string
): Promise<ConnectionResponse> {
    localStorage.removeItem('t');
    if (!authorizationCode) {
        let url = new URL(window.location.href);
        let state = Utility.generateRandomString(32);
        localStorage.setItem('t_s', state);
        window.open(
            'https://auth.dilanxd.com/authenticate?client_id=' +
                process.env.REACT_APP_PUBLIC_CLIENT_ID +
                '&redirect_uri=' +
                encodeURIComponent(url.toString()) +
                '&state=' +
                state,
            '_self'
        );
        return { success: true, data: '' };
    }

    if (state !== localStorage.getItem('t_s')) {
        return { success: false, data: 'State Mismatch' };
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
            body: JSON.stringify({
                client_id: process.env.REACT_APP_PUBLIC_CLIENT_ID,
                code: authorizationCode,
            }),
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
    localStorage.removeItem('t');
    let url = new URL(window.location.href);
    window.open(
        `https://auth.dilanxd.com/authenticate/logout?redirect_uri=${encodeURIComponent(
            url.toString()
        )}`,
        '_self'
    );
    return { success: true, data: '' };
}

async function planOperation(
    endpoint: string,
    method: string,
    body?: object,
    autoAuth?: boolean
): Promise<AccountPlansData | undefined> {
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
            if (autoAuth ?? true) authLogin();
            return;
        }

        let res = await response.json();
        if (!response.ok) {
            throw new PlanError(res.error as string);
        }

        plans = res;
        return res as AccountPlansData;
    } catch (error) {
        throw new PlanError('Connection Failure');
    }
}

let Account = {
    isLoggedIn: () => {
        return !!localStorage.getItem('t');
    },
    logIn: (authorizationCode?: string, state?: string) => {
        return authLogin(authorizationCode, state);
    },
    logOut: () => authLogout(),
    init: () => {
        return planOperation('', 'GET', undefined, false);
    },
    getPlans: (reload = false) => {
        if (plans && !reload) {
            return Promise.resolve(plans);
        }
        return planOperation('', 'GET');
    },
    createPlan: (name: string) => {
        return planOperation('', 'POST', { name });
    },
    deletePlan: (planId: string) => {
        return planOperation(planId, 'DELETE');
    },
    updatePlan: (planId: string, content: string) => {
        return planOperation(planId, 'PATCH', { content });
    },
    getPlanName: (planId?: string) => {
        if (!planId) return 'Log in';
        if (planId === 'None') return 'None';
        if (!plans) {
            return 'err';
        }
        return plans[planId].name.toUpperCase();
    },
};

export default Account;
