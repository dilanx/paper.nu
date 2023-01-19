import PlanError from './utility/PlanError';
import {
  Document,
  AuthenticationResponseToken,
  ConnectionResponse,
  UserInformation,
  GetResponse,
  CreateResponse,
  DocumentCache,
  DocumentType,
  UpdateResponse,
  DeleteResponse,
} from './types/AccountTypes';
import Utility from './utility/Utility';
import debug from 'debug';
var da = debug('account:auth');
var dh = debug('account:http');
var dp = debug('account:op');

const TOKEN_URL = 'https://auth.dilanxd.com/authenticate/token';
const SERVER = 'https://auth.dilanxd.com';

const cache: DocumentCache = {};

function getTypeId(type: DocumentType) {
  switch (type) {
    case 'plans':
      return 1;
    case 'schedules':
      return 2;
    default:
      return 0;
  }
}

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

async function operation<T>(
  endpoint: string,
  method: string,
  body?: object,
  autoAuth = true
): Promise<T | undefined> {
  dh('%s %s (body: %o)', method, endpoint, body);
  try {
    const response = await fetch(SERVER + endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('t')}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401) {
      dp('access token invalid, refresh required');
      if (autoAuth) authLogin();
      return;
    }

    let res = await response.json();
    if (!response.ok) {
      throw new PlanError(res.error as string);
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
  init: async () => {
    dp('initialize');

    const plans = await Account.get('plans', true, true, false);
    const schedules = await Account.get('schedules', true, true, false);

    return { plans, schedules };
  },
  getUser: async () => {
    dp('user: get');
    if (cache.user) {
      dp('user: cache hit');
      return Promise.resolve(cache.user);
    }
    dp('user: cache miss');
    const res = await operation<UserInformation>(
      '/user',
      'GET',
      undefined,
      false
    );
    if (res) cache.user = res;
    return res;
  },
  get: async (
    type: DocumentType,
    reload = false,
    updateCache = true,
    autoAuth = true
  ) => {
    dp(`${type}: get`);
    if (cache[type] && !reload) {
      dp(`${type}: cache hit`);
      return cache[type];
    }
    dp(`${type}: cache miss`);
    const res = await operation<GetResponse>(
      `/paper/documents?type=${getTypeId(type)}`,
      'GET',
      undefined,
      autoAuth
    );
    if (updateCache && res) cache[type] = res.documents;
    return res?.documents;
  },
  create: async (type: DocumentType, name: string) => {
    dp(`${type}: create`);
    const res = await operation<CreateResponse>('/paper/documents', 'POST', {
      type: getTypeId(type),
      name,
    });

    if (!cache[type]) cache[type] = await Account.get(type, true, false);
    if (res) {
      cache[type]?.push(res.document);
    }

    return cache[type];
  },
  update: async (type: DocumentType, id: string, body: Partial<Document>) => {
    dp(`${type}: update`);
    const res = await operation<UpdateResponse>(
      `/paper/documents/${id}`,
      'PATCH',
      body
    );
    if (!cache[type]) cache[type] = await Account.get(type, true, false);
    if (res) {
      cache[type] = cache[type]?.map((doc) => {
        if (doc.id === id) return res.document;
        return doc;
      });
    }

    return cache[type];
  },
  delete: async (type: DocumentType, id: string) => {
    dp(`${type}: delete`);
    const res = await operation<DeleteResponse>(
      `/paper/documents/${id}`,
      'DELETE'
    );
    if (!cache[type]) cache[type] = await Account.get(type, true, false);
    if (res) {
      cache[type] = cache[type]?.filter((doc) => doc.id !== id);
    }

    return cache[type];
  },
  getPlanName: (planId: string) => {
    if (planId === 'None') return 'None';
    const plan = cache.plans?.find((plan) => plan.id === planId);
    if (!plan) {
      return '-';
    }
    return plan.name.toUpperCase();
  },
  getScheduleName: (scheduleId: string) => {
    if (scheduleId === 'None') return 'None';
    const schedule = cache.schedules?.find(
      (schedule) => schedule.id === scheduleId
    );
    if (!schedule) {
      return '-';
    }
    return schedule.name.toUpperCase();
  },
};

export default Account;
