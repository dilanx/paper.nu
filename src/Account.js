const TOKEN_URL = 'https://auth.dilanxd.com/authenticate/token';
const LOGOUT_URL = 'https://auth.dilanxd.com/authenticate/logout';
const PLANS_URL = 'https://auth.dilanxd.com/plan-nu/plans';

var plans = null;

async function authLogin(authorizationCode) {
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
        return;
    }

    let token = await obtainAccessToken(authorizationCode);
    if (token.error) {
        return { success: false, error: token.error };
    }
    localStorage.setItem('t', token);
    return { success: true };
}

async function obtainAccessToken(authorizationCode) {
    try {
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: authorizationCode }),
        });

        const data = await response.json();

        if (!response.ok) {
            return data;
        }

        return data.access_token;
    } catch (error) {
        return {
            error: 'Connection Failure',
        };
    }
}

async function authLogout() {
    try {
        const response = await fetch(LOGOUT_URL);
        const data = await response.json();
        if (!data.success) {
            return data;
        }
        localStorage.removeItem('t');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Connection Failure' };
    }
}

async function planOperation(endpoint, method, body) {
    try {
        const response = await fetch(PLANS_URL + '/' + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('t')}`,
            },
            body: body,
        });
        if (response.status === 401) {
            authLogin();
            return { error: 'Authorization Error' };
        }
        return await response.json();
    } catch (error) {
        return { error: 'Connection Failure' };
    }
}

let Account = {
    isLoggedIn: () => {
        return !!localStorage.getItem('t');
    },
    login: async authorizationCode => {
        return await authLogin(authorizationCode);
    },
    logout: async () => {
        return await authLogout();
    },
    getPlans: async (reload = false) => {
        return {
            abcde: {
                name: 'plan',
                lastUpdated: 123456,
            },
            fghij: {
                name: 'plan2',
                lastUpdated: 123456,
            },
        };
        if (plans && !reload) {
            return plans;
        }
        let response = await planOperation('', 'GET');
        if (!response.error) {
            plans = response;
        }
        return response;
    },
    delPlan: async planId => {
        let response = await planOperation(planId, 'DELETE');
    },
};

export default Account;
