import {
  AuthenticationResponseToken,
  ConnectionResponse,
  CreateResponse,
  DeleteResponse,
  Document,
  DocumentCache,
  DocumentType,
  GetResponse,
  OperationOptions,
  SharePostResponse,
  UpdateResponse,
  UserInformation,
} from '@/types/AccountTypes';
import {
  CachedRatings,
  CourseRating,
  RateResponse,
  RatingInfo,
  SummaryRatingResponse,
} from '@/types/RatingTypes';
import { RATINGS_CACHE_EXPIRE_TIME } from '@/utility/Constants';
import { PaperError, PaperExpectedAuthError } from '@/utility/PaperError';
import Links from '@/utility/StaticLinks';
import { generateRandomString } from '@/utility/Utility';
import debug from 'debug';
import localforage from 'localforage';
const da = debug('account:auth');
const dh = debug('account:http');
const dp = debug('account:op');
const ds = debug('account:storage-cache');

const memoryCache: DocumentCache = {};

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
    const url = new URL(window.location.href);
    url.searchParams.set('action', 'login');
    const state = generateRandomString(32);
    localStorage.setItem('t_s', state);
    da('no auth code in query, new access token required, redirecting');
    window.open(
      Links.AUTH +
        '?client_id=' +
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

  const token = await obtainAccessToken(authorizationCode);

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
    const response = await fetch(Links.TOKEN, {
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
  const url = new URL(window.location.href);
  url.searchParams.set('action', 'logout');
  window.open(
    `${Links.AUTH}/logout?redirect_uri=${encodeURIComponent(
      url.toString()
    )}&action=logout`,
    '_self'
  );
  return { success: true, data: '' };
}

async function operation<T>(
  endpoint: string,
  method: string,
  { body, useAuth = true, autoAuth = true }: OperationOptions = {}
): Promise<T | undefined> {
  dh('%s %s (body: %o)', method, endpoint, body);
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (useAuth) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('t')}`;
    }

    const response = await fetch(Links.SERVER + endpoint, {
      method: method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      dp('access token invalid, refresh required');
      if (autoAuth) authLogin();
      return;
    }

    if (response.status === 403) {
      dp('forbidden, notifying to logout');
      throw new PaperExpectedAuthError('Forbidden');
    }

    const res = await response.json();
    if (!response.ok) {
      throw new PaperError(res.error as string, response.status);
    }

    return res as T;
  } catch (error) {
    if (error instanceof PaperError) {
      throw error;
    }

    throw new PaperError('Connection Failure');
  }
}

async function updateCache(type: DocumentType, data?: Document) {
  if (!memoryCache[type])
    memoryCache[type] = await getDocument(type, true, false);
  if (data) {
    memoryCache[type] = memoryCache[type]?.map((doc) => {
      if (doc.id === data.id) return data;
      return doc;
    });
  }

  return memoryCache[type];
}

export function isLoggedIn() {
  return !!localStorage.getItem('t');
}

export function login(authorizationCode?: string, state?: string) {
  return authLogin(authorizationCode, state);
}

export function logout() {
  return authLogout();
}

export async function initAccount() {
  dp('initialize');

  const plans = await getDocument('plans', true, true, false);
  const schedules = await getDocument('schedules', true, true, false);

  return { plans, schedules };
}

export async function getUser() {
  dp('user: get');
  if (memoryCache.user) {
    dp('user: cache hit');
    return Promise.resolve(memoryCache.user);
  }
  dp('user: cache miss');
  const res = await operation<UserInformation>('/user', 'GET', {
    autoAuth: false,
  });
  if (res) memoryCache.user = res;
  return res;
}

export async function getDocument(
  type: DocumentType,
  reload = false,
  updateCache = true,
  autoAuth = true
) {
  dp(`${type}: get`);
  if (memoryCache[type] && !reload) {
    dp(`${type}: cache hit`);
    return memoryCache[type];
  }

  if (reload) {
    dp(`${type}: ignoring cache and reloading`);
  }

  dp(`${type}: cache miss`);
  const res = await operation<GetResponse>(
    `/paper/documents?type=${getTypeId(type)}`,
    'GET',
    { autoAuth }
  );
  if (updateCache && res) memoryCache[type] = res.documents;
  return res?.documents;
}

export async function createDocument(
  type: DocumentType,
  name: string,
  body?: Partial<Document>
) {
  dp(`${type}: ${body ? 'duplicate' : 'create'}`);
  const res = await operation<CreateResponse>('/paper/documents', 'POST', {
    body: {
      type: getTypeId(type),
      name,
      ...(body || {}),
    },
  });

  if (!memoryCache[type])
    memoryCache[type] = await getDocument(type, true, false);
  if (res) {
    memoryCache[type]?.push(res.document);
  }

  return memoryCache[type];
}

export async function updateDocument(
  type: DocumentType,
  id: string,
  body: Partial<Document>
) {
  dp(`${type}: update`);
  const res = await operation<UpdateResponse>(
    `/paper/documents/${id}`,
    'PATCH',
    { body: { ...body, type: type === 'plans' ? 1 : 2 } }
  );

  return await updateCache(type, res?.document);
}

export async function deleteDocument(type: DocumentType, id: string) {
  dp(`${type}: delete`);
  const res = await operation<DeleteResponse>(
    `/paper/documents/${id}`,
    'DELETE'
  );
  if (!memoryCache[type])
    memoryCache[type] = await getDocument(type, true, false);
  if (res) {
    memoryCache[type] = memoryCache[type]?.filter((doc) => doc.id !== id);
  }

  return memoryCache[type];
}

export function getPlan(planId: string | undefined) {
  if (!planId || planId === 'None') return undefined;
  return memoryCache.plans?.find((plan) => plan.id === planId);
}

export function getPlanName(planId: string | undefined) {
  if (planId === 'None') return 'None';
  const plan = memoryCache.plans?.find((plan) => plan.id === planId);
  if (!plan) {
    return '-';
  }
  return plan.name;
}

export function getSchedule(scheduleId: string | undefined) {
  if (!scheduleId || scheduleId === 'None') return undefined;
  return memoryCache.schedules?.find((schedule) => schedule.id === scheduleId);
}

export function getScheduleName(scheduleId: string | undefined) {
  if (scheduleId === 'None') return 'None';
  const schedule = memoryCache.schedules?.find(
    (schedule) => schedule.id === scheduleId
  );
  if (!schedule) {
    return '-';
  }
  return schedule.name;
}

export async function sharePersistent(type: DocumentType, id: string) {
  dp(`${type}: share persistent`);
  const response = await operation<SharePostResponse>(
    `/paper/share/${id}`,
    'POST'
  );
  await updateCache(type, response?.document);
  return response;
}

export async function revokePersistent(type: DocumentType, id: string) {
  dp(`${type}: revoke persistent`);
  const response = await operation<SharePostResponse>(
    `/paper/share/${id}`,
    'DELETE'
  );
  await updateCache(type, response?.document);
  return response;
}

export async function getBasicRating(course: string) {
  dp(`rating: get basic for %s`, course);

  const cacheKey = `ratings.${course.replace(' ', '_')}.overview`;

  const cached = await localforage.getItem<CachedRatings>(cacheKey);

  if (cached?.summary) {
    if (cached.timestamp + RATINGS_CACHE_EXPIRE_TIME > Date.now()) {
      ds(`rating: cache hit for %s`, course);
      return cached.summary;
    }
    ds(`rating: cache expired for %s`, course);
  } else {
    ds(`rating: cache miss for %s`, course);
  }

  const response = await operation<SummaryRatingResponse>(
    `/paper/ratings/basic?course=${encodeURIComponent(course)}`,
    'GET',
    { useAuth: false }
  );

  if (response?.overall) {
    ds(`rating: cache set for %s`, course);
    await localforage.setItem<CachedRatings>(cacheKey, {
      timestamp: Date.now(),
      summary: response.overall,
    });
  }

  return response?.overall;
}

export async function getDetailedRatings(course: string, reload = false) {
  dp(`rating: get detailed for %s`, course);

  const cacheKey = `ratings.${course.replace(' ', '_')}.detailed`;

  const cached = await localforage.getItem<CachedRatings>(cacheKey);

  if (cached?.data && !reload) {
    if (cached.timestamp + RATINGS_CACHE_EXPIRE_TIME > Date.now()) {
      ds(`rating: cache hit for %s`, course);
      return cached.data;
    }
    ds(`rating: cache expired for %s`, course);
  } else {
    if (reload) {
      ds(`rating: ignoring cache and reloading for %s`, course);
    }

    ds(`rating: cache miss for %s`, course);
  }

  const response = await operation<RatingInfo>(
    `/paper/ratings/detailed?course=${encodeURIComponent(course)}`,
    'GET',
    { autoAuth: false }
  );

  if (response) {
    ds(`rating: cache set for %s`, course);
    await localforage.setItem<CachedRatings>(cacheKey, {
      timestamp: Date.now(),
      data: response,
    });
  }

  return response;
}

export async function rate(course: string, ratings: CourseRating) {
  dp(`rating: rate %s`, course);
  const response = await operation<RateResponse>(`/paper/ratings`, 'POST', {
    body: {
      course,
      ratings,
    },
  });

  return response;
}
