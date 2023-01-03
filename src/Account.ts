import PlanError from './utility/PlanError';
import {
  AccountDataMap,
  AuthenticationResponseToken,
  ConnectionResponse,
  UserInformation,
} from './types/AccountTypes';
import Utility from './utility/Utility';
import debug from 'debug';
var da = debug('account:auth');
var dh = debug('account:http');
var dp = debug('account:op');

const TOKEN_URL = 'https://auth.dilanxd.com/authenticate/token';
const ENDPOINT = 'https://auth.dilanxd.com/plan-nu';

let user: UserInformation | undefined = undefined;
let plans: AccountDataMap | undefined = undefined;
let schedules: AccountDataMap | undefined = undefined;

async function authLogin(
  authorizationCode?: string,
  state?: string
): Promise<ConnectionResponse> {
  da('auth login');
  localStorage.removeItem('t');
  if (!authorizationCode) {
    let url = new URL(window.location.href);
    url.searchParams.set('action', 'login');
    let state = Utility.generateRandomString(32);
    localStorage.setItem('t_s', state);
    da('no auth code in query, new access token required, redirecting');
    window.open(
      'https://auth.dilanxd.com/authenticate?client_id=' +
        process.env.REACT_APP_PUBLIC_CLIENT_ID +
        '&redirect_uri=' +
        encodeURIComponent(url.toString()) +
        '&state=' +
        state +
        '&action=login',
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
  da('auth login successful');
  return { success: true, data: '' };
}

async function obtainAccessToken(
  authorizationCode: string
): Promise<AuthenticationResponseToken> {
  try {
    dh('POST token');
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
  da('auth logout');
  localStorage.removeItem('t');
  let url = new URL(window.location.href);
  url.searchParams.set('action', 'logout');
  window.open(
    `https://auth.dilanxd.com/authenticate/logout?redirect_uri=${encodeURIComponent(
      url.toString()
    )}&action=logout`,
    '_self'
  );
  return { success: true, data: '' };
}

async function operation<T = AccountDataMap>(
  endpoint: string,
  method: string,
  body?: object,
  autoAuth?: boolean,
  customEndpoint?: string
): Promise<T | undefined> {
  dh('%s /%s (body: %o)', method, endpoint, body);
  try {
    const response = await fetch(
      (customEndpoint ?? ENDPOINT) + '/' + endpoint,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('t')}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      }
    );
    if (response.status === 401) {
      dp('access token invalid, refresh required');
      if (autoAuth ?? true) authLogin();
      return;
    }

    let res = await response.json();
    if (!response.ok) {
      throw new PlanError(res.error as string);
    }

    if (endpoint.startsWith('plans')) {
      plans = res;
    }
    if (endpoint.startsWith('schedules')) {
      schedules = res;
    }
    if (endpoint.startsWith('user')) {
      user = res;
    }

    return res as T;
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
    dp('initialize');
    return {
      plans: operation('plans', 'GET', undefined, false),
      schedule: operation('schedules', 'GET', undefined, false),
    };
  },
  getUser: () => {
    dp('user: get');
    if (user) {
      dp('user: cache hit');
      return Promise.resolve(user);
    }
    dp('user: cache miss');
    return operation<UserInformation>(
      'user',
      'GET',
      undefined,
      false,
      'https://auth.dilanxd.com'
    );
  },
  getPlans: (reload = false) => {
    dp('plans: get');
    if (plans && !reload) {
      dp('plans: cache hit');
      return Promise.resolve(plans);
    }
    dp('plans: cache miss');
    return operation('plans', 'GET');
  },
  createPlan: (name: string) => {
    dp('plans: create');
    return operation('plans', 'POST', { name });
  },
  deletePlan: (planId: string) => {
    dp('plans: delete');
    return operation('plans/' + planId, 'DELETE');
  },
  editPlanInfo: (planId: string, newName: string) => {
    dp('plans: edit info');
    return operation('plans/' + planId, 'PATCH', { name: newName });
  },
  updatePlan: (planId: string, content: string) => {
    dp('plans: update');
    return operation('plans/' + planId, 'PATCH', { content });
  },
  getPlanName: (planId?: string) => {
    if (!planId) return 'Log in';
    if (planId === 'None') return 'None';
    if (!plans || !plans[planId]) {
      return '-';
    }
    return plans[planId].name.toUpperCase();
  },
  getSchedules: (reload = false) => {
    dp('schedules: get');
    if (schedules && !reload) {
      dp('schedules: cache hit');
      return Promise.resolve(schedules);
    }
    dp('schedules: cache miss');
    return operation('schedules', 'GET');
  },
  createSchedule: (name: string) => {
    dp('schedules: create');
    return operation('schedules', 'POST', { name });
  },
  deleteSchedule: (scheduleId: string) => {
    dp('schedules: delete');
    return operation('schedules/' + scheduleId, 'DELETE');
  },
  editScheduleInfo: (scheduleId: string, newName: string) => {
    dp('schedules: edit info');
    return operation('schedules/' + scheduleId, 'PATCH', { name: newName });
  },
  updateSchedule: (scheduleId: string, content: string) => {
    dp('schedules: update');
    return operation('schedules/' + scheduleId, 'PATCH', { content });
  },
  getScheduleName: (scheduleId?: string) => {
    if (!scheduleId) return 'Log in';
    if (scheduleId === 'None') return 'None';
    if (!schedules || !schedules[scheduleId]) {
      return '-';
    }
    return schedules[scheduleId].name.toUpperCase();
  },
};

export default Account;
