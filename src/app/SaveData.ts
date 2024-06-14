import debug from 'debug';
import { isEqual } from 'lodash';
import { getDataMapInformation, getPlanData, getScheduleData } from './Data';
import { Document, RecentShareItem } from '@/types/AccountTypes';
import {
  LoadMethods,
  LoadResponse,
  ReadUserOptions,
  SaveDataOptions,
  UserOptions,
} from '@/types/BaseTypes';
import {
  Course,
  PlanData,
  SerializedPlanData,
  isSerializedPlanData,
} from '@/types/PlanTypes';
import {
  ScheduleData,
  ScheduleSection,
  SerializedScheduleData,
  isSerializedScheduleData,
} from '@/types/ScheduleTypes';
import { Mode } from '@/utility/Constants';
import Links from '@/utility/StaticLinks';
import { initAccount, isLoggedIn } from './Account';
import {
  loadSchedule,
  loadScheduleFromStorage,
  saveSchedule,
  serializeSchedule,
} from './Schedule';
import { loadPlan, loadPlanFromStorage, savePlan, serializePlan } from './Plan';
import { isStringEntirelyAnumber } from '@/utility/Utility';
const d = debug('save-data-manager');

const DEFAULT_USER_OPTIONS: ReadUserOptions = {
  notifications: true,
  settings_tab: 'General',
  mode: Mode.PLAN,
  schedule_warnings: true,
  minimap: true,
};

function matchAccountId(
  accountData: Document[],
  data: SerializedPlanData | SerializedScheduleData
) {
  for (const doc of accountData) {
    if (isEqual(doc.data, data)) {
      return doc.id;
    }
  }
}

export async function load(
  userOptions: UserOptions,
  { hash, changeTerm, showCourse, showSection }: SaveDataOptions = {}
): Promise<LoadResponse<PlanData | ScheduleData>> {
  let activeId: string | undefined = undefined;
  let accountPlans: Document[] | undefined = undefined;
  let accountSchedules: Document[] | undefined = undefined;
  let sharedCourse: Course | undefined = undefined;
  let sharedSection: ScheduleSection | undefined = undefined;
  const latestTermId = (await getDataMapInformation()).latest;

  let serializedData: SerializedPlanData | SerializedScheduleData | null = null;

  let recentShare: RecentShareItem | string | undefined = undefined;

  const ret = (
    mode: Mode,
    data: PlanData | ScheduleData | 'malformed' | 'empty',
    method: LoadMethods,
    error?: string
  ): LoadResponse<PlanData | ScheduleData> => {
    return {
      mode,
      data,
      method,
      activeId,
      latestTermId,
      error,
      sharedCourse,
      sharedSection,
      recentShare,
    };
  };

  if (isLoggedIn()) {
    const accountInit = await initAccount();
    accountPlans = accountInit.plans;
    accountSchedules = accountInit.schedules;
    activeId = 'None';
  }

  if (changeTerm) {
    d('changing term to %s', changeTerm);
    const data = await loadSchedule({ termId: changeTerm });
    return {
      mode: Mode.SCHEDULE,
      data,
      method: 'TermChange',
      latestTermId,
    };
  }

  if (showCourse) {
    d('showing shared course %s', showCourse);
    const data = await getPlanData();
    const course = data.courses.find((c) => c.id === showCourse);
    if (course) {
      sharedCourse = course;
    } else {
      d('shared course %s not found', showCourse);
    }
  }

  if (showSection) {
    d('showing shared section %s', showSection);
    const [term, courseId, sectionId] = showSection.split('-');
    if (term && courseId && sectionId) {
      const data = await getScheduleData(term);
      if (data) {
        const course = data.data.find((c) => c.course_id === courseId);
        if (course) {
          const section = course.sections.find((s) => s.section === sectionId);
          if (section) {
            sharedSection = section;
            d('shared section %s found', sectionId);
          } else {
            d('shared section %s not found in course %s', sectionId, courseId);
          }
        } else {
          d('shared section course %s not found in term %s', courseId, term);
        }
      } else {
        d('failed to fetch schedule data for shared section term %s', term);
      }
    } else {
      d('invalid shared section format, ignoring');
    }
  }

  if (hash) {
    d('hash short code %s detected, trying to load', hash);
    if (hash.length !== 9) {
      if (hash.length === 13) {
        d('hash is 13 chars, might be a legacy short code');
        return ret(
          Mode.PLAN,
          'malformed',
          'URL',
          'Pre-v3 share codes are no longer supported.'
        );
      }
      d('hash is not 9 chars (# + 8), not a short code');
      return ret(Mode.PLAN, 'malformed', 'URL', 'The share URL is invalid.');
    }
    d('fetching content for short code from server');
    const shareCode = hash.slice(1).toUpperCase();
    const scContentResponse = await fetch(
      `${Links.SERVER}/paper/share/${shareCode}`
    );
    recentShare = shareCode;

    if (!scContentResponse.ok) {
      if (scContentResponse.status === 403) {
        d('short code is not public');
        return ret(
          Mode.PLAN,
          'malformed',
          'URL',
          'The shared document you are trying to retrieve is no longer public.'
        );
      }
      d('failed to fetch short code with error %s', scContentResponse.status);
      return ret(Mode.PLAN, 'malformed', 'URL', 'The share URL is invalid.');
    }
    const scContent = await scContentResponse.json();
    if (!scContent.data) {
      d('short code has no data');
      return ret(Mode.PLAN, 'malformed', 'URL');
    }
    serializedData = scContent.data as
      | SerializedPlanData
      | SerializedScheduleData;
    d('fetched content for short code URL, trying to load');

    if (serializedData) {
      if (isSerializedPlanData(serializedData)) {
        d('URL data is plan data');
        const planData = await loadPlan(serializedData);

        if (planData === 'empty') {
          d('plan URL data is empty');
          return ret(
            Mode.PLAN,
            planData,
            'URL',
            'The shared document you are trying to retrieve has no content.'
          );
        }

        if (planData !== 'malformed') {
          d('plan URL load successful');
          savePlan(planData, userOptions);
          if (scContent.persistent) {
            recentShare = {
              shortCode: shareCode,
              type: 1,
              name: scContent.name,
              owner: scContent.owner,
            };
          }
        }
        return ret(Mode.PLAN, planData, 'URL');
      } else if (isSerializedScheduleData(serializedData)) {
        d('URL data is schedule data');
        const scheduleData = await loadSchedule(serializedData);

        if (scheduleData === 'empty') {
          d('schedule URL data is empty');
          return ret(
            Mode.SCHEDULE,
            scheduleData,
            'URL',
            'The shared document you are trying to retrieve has no content.'
          );
        }

        if (scheduleData !== 'malformed') {
          d('schedule URL load successful');
          saveSchedule(scheduleData, userOptions);
          if (scContent.persistent) {
            recentShare = {
              shortCode: shareCode,
              type: 2,
              name: scContent.name,
              owner: scContent.owner,
              termId: scheduleData.termId,
            };
          }
        }
        return ret(Mode.SCHEDULE, scheduleData, 'URL');
      } else {
        d('URL data does not match plan or schedule format');
        return ret(Mode.SCHEDULE, 'malformed', 'URL');
      }
    }
  }

  d('nothing to load from URL');

  const mode = userOptions.get.mode as Mode;
  d('last mode used is %d', mode);

  const isPlan = mode === Mode.PLAN;
  const modeStr = isPlan ? 'plan' : 'schedule';
  const storedId = isPlan
    ? userOptions.get.active_plan_id
    : userOptions.get.active_schedule_id;
  const accountDocs = isPlan ? accountPlans : accountSchedules;
  const checkSerialization = isPlan
    ? isSerializedPlanData
    : isSerializedScheduleData;

  d('trying to load %s data from account', modeStr);
  if (accountDocs && storedId) {
    const doc = accountDocs.find((doc) => doc.id === storedId);
    const sData = doc?.data;
    if (checkSerialization(sData)) {
      const data = isPlan
        ? await loadPlan(sData as SerializedPlanData)
        : await loadSchedule(sData as SerializedScheduleData);
      if (data !== 'empty') {
        if (data !== 'malformed') {
          d('account %s load successful: %s', modeStr, storedId);
          activeId = storedId;
          isPlan
            ? savePlan(data as PlanData, userOptions)
            : saveSchedule(data as ScheduleData, userOptions);
          d('%s data loaded', modeStr);
        }

        return ret(mode, data, 'Account');
      }
    }
  }

  d('nothing to load from account, trying storage instead');
  const data = isPlan
    ? await loadPlanFromStorage()
    : await loadScheduleFromStorage();
  if (data !== 'empty') {
    let method: LoadMethods = 'Storage';
    if (data !== 'malformed') {
      d('%s storage load successful', modeStr);
      if (accountDocs) {
        const sData = isPlan
          ? serializePlan(data as PlanData)
          : serializeSchedule(data as ScheduleData);
        const id = matchAccountId(accountDocs, sData);
        if (id) {
          d('matched data to account %s: %s', modeStr, id);
          activeId = id;
          method = 'Account';
        }
      }
      isPlan
        ? savePlan(data as PlanData, userOptions)
        : saveSchedule(data as ScheduleData, userOptions);
      d('%s data loaded', modeStr);
    }

    return ret(mode, data, method);
  }

  d('no data to load');
  return ret(mode, isPlan ? await loadPlan() : await loadSchedule(), 'None');
}

export function loadUserOptionsFromStorage(
  setUserOption: (
    key: keyof ReadUserOptions,
    val: any,
    save: boolean | undefined
  ) => void
): UserOptions {
  const options = Object.assign<ReadUserOptions, ReadUserOptions>(
    {},
    DEFAULT_USER_OPTIONS
  );
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith('switch_')) {
      const store = localStorage.getItem(keys[i]);
      let val: any = undefined;
      if (store != null) {
        if (store === 'true') val = true;
        else if (store === 'false') val = false;
        else if (isStringEntirelyAnumber(store)) val = parseInt(store);
        else val = store;
      }
      const optionId = keys[i].substring(7) as keyof ReadUserOptions;
      options[optionId] = val;
    }
  }

  if (options.debug) {
    debug.enable('*');
  } else {
    debug.disable();
  }

  options.tab = 'Search';

  return { get: options, set: setUserOption };
}

export function saveUserOptionToStorage(key: string, val?: string) {
  if (val) {
    localStorage.setItem('switch_' + key, val);
  } else {
    localStorage.removeItem('switch_' + key);
  }
}
