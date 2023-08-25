import debug from 'debug';
import Account from './Account';
import {
  getDataMapInformation,
  getPlanData,
  getScheduleData,
} from './DataManager';
import PlanManager from './PlanManager';
import ScheduleManager from './ScheduleManager';
import { Document } from './types/AccountTypes';
import {
  LoadMethods,
  LoadResponse,
  ReadUserOptions,
  SaveDataOptions,
  UserOptions,
} from './types/BaseTypes';
import {
  Course,
  PlanData,
  SerializedPlanData,
  isSerializedPlanData,
} from './types/PlanTypes';
import {
  ScheduleData,
  ScheduleSection,
  SerializedScheduleData,
  isSerializedScheduleData,
} from './types/ScheduleTypes';
import { Mode } from './utility/Constants';
import Utility from './utility/Utility';
import { isEqual } from 'lodash';
const d = debug('save-data-manager');

const DEFAULT_SWITCHES: ReadUserOptions = {
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
  for (let doc of accountData) {
    if (isEqual(doc.data, data)) {
      return doc.id;
    }
  }
}

let SaveDataManager = {
  load: async (
    switches: UserOptions,
    { hash, changeTerm, showCourse, showSection }: SaveDataOptions = {}
  ): Promise<LoadResponse<PlanData | ScheduleData>> => {
    let activeId: string | undefined = undefined;
    let accountPlans: Document[] | undefined = undefined;
    let accountSchedules: Document[] | undefined = undefined;
    let method: LoadMethods = 'None';
    let sharedCourse: Course | undefined = undefined;
    let sharedSection: ScheduleSection | undefined = undefined;
    const latestTermId = (await getDataMapInformation()).latest;

    let serializedData: SerializedPlanData | SerializedScheduleData | null =
      null;

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
      };
    };

    if (Account.isLoggedIn()) {
      const accountInit = await Account.init();
      accountPlans = accountInit.plans;
      accountSchedules = accountInit.schedules;
      activeId = 'None';
    }

    if (changeTerm) {
      d('changing term to %s', changeTerm);
      const data = await ScheduleManager.load({ termId: changeTerm });
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
            const section = course.sections.find(
              (s) => s.section === sectionId
            );
            if (section) {
              sharedSection = section;
              d('shared section %s found', sectionId);
            } else {
              d(
                'shared section %s not found in course %s',
                sectionId,
                courseId
              );
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
      if (hash.length !== 13) {
        d('hash is not 13 chars (# + 12), not a short code');
        return ret(Mode.PLAN, 'malformed', 'URL');
      }
      d('fetching content for short code from server');
      const scContentResponse = await fetch(
        `${Account.SERVER}/paper/shorten/${hash.slice(1)}`
      );
      if (!scContentResponse.ok) {
        d('failed to fetch short code with error %s', scContentResponse.status);
        return ret(Mode.PLAN, 'malformed', 'URL');
      }
      const scContent = await scContentResponse.json();
      if (!scContent.data) {
        d('short code has no data, thus must have legacy data');
        return ret(Mode.PLAN, 'malformed', 'URL', 'legacy');
      }
      serializedData = JSON.parse(scContent.data) as SerializedPlanData;
      d('fetched content for short code URL, trying to load');

      if (serializedData) {
        if (isSerializedPlanData(serializedData)) {
          d('URL data is plan data');
          const planData = await PlanManager.load(serializedData);
          if (planData !== 'empty') {
            if (planData !== 'malformed') {
              d('plan URL load successful');
              method = 'URL';
              PlanManager.save(planData, switches);
            }
            return ret(Mode.PLAN, planData, method);
          }
        } else if (isSerializedScheduleData(serializedData)) {
          d('URL data is schedule data');
          const scheduleData = await ScheduleManager.load(serializedData);
          if (scheduleData !== 'empty') {
            if (scheduleData !== 'malformed') {
              method = 'URL';
              d('schedule URL load successful');
              ScheduleManager.save(scheduleData, switches);
            }
            return ret(Mode.SCHEDULE, scheduleData, method);
          }
        } else {
          d('URL data does not match plan or schedule format');
          return ret(Mode.SCHEDULE, 'malformed', method);
        }
      }
    }

    d('nothing to load from URL');

    const mode = switches.get.mode as Mode;
    d('last mode used is %d', mode);

    const isPlan = mode === Mode.PLAN;
    const modeStr = isPlan ? 'plan' : 'schedule';
    const manager = isPlan ? PlanManager : ScheduleManager;
    const storedId = isPlan
      ? switches.get.active_plan_id
      : switches.get.active_schedule_id;
    const accountDocs = isPlan ? accountPlans : accountSchedules;
    const checkSerialization = isPlan
      ? isSerializedPlanData
      : isSerializedScheduleData;

    d('trying to load %s data from account', modeStr);
    if (accountDocs && storedId) {
      const doc = accountDocs.find((doc) => doc.id === storedId);
      const sData = doc?.data;
      if (checkSerialization(sData)) {
        const data = await manager.load(sData as any);
        if (data !== 'empty') {
          if (data !== 'malformed') {
            d('account %s load successful: %s', modeStr, storedId);
            activeId = storedId;
            manager.save(data as any, switches);
            d('%s data loaded', modeStr);
          }

          return ret(mode, data, 'Account');
        }
      }
    }

    d('nothing to load from account, trying storage instead');
    const data = await manager.loadFromStorage();
    if (data !== 'empty') {
      if (data !== 'malformed') {
        d('%s storage load successful', modeStr);
        method = 'Storage';
        if (accountDocs) {
          const sData = manager.serialize(data as any);
          const id = matchAccountId(accountDocs, sData);
          if (id) {
            d('matched data to account %s: %s', modeStr, id);
            activeId = id;
            method = 'Account';
          }
        }
        manager.save(data as any, switches);
        d('%s data loaded', modeStr);
      }

      return ret(mode, data, method);
    }

    d('no data to load');
    return ret(mode, await manager.load(), method);
  },

  loadSwitchesFromStorage: (
    setSwitchFunction: (
      key: keyof ReadUserOptions,
      val: any,
      save: boolean | undefined
    ) => void
  ): UserOptions => {
    let switches = Object.assign<ReadUserOptions, ReadUserOptions>(
      {},
      DEFAULT_SWITCHES
    );
    let keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].startsWith('switch_')) {
        let store = localStorage.getItem(keys[i]);
        let val: any = undefined;
        if (store != null) {
          if (store === 'true') val = true;
          else if (store === 'false') val = false;
          else if (Utility.isStringEntirelyANumber(store))
            val = parseInt(store);
          else val = store;
        }
        let switchId = keys[i].substring(7) as keyof ReadUserOptions;
        switches[switchId] = val;
      }
    }

    if (switches.debug) {
      debug.enable('*');
    } else {
      debug.disable();
    }

    return {
      set: setSwitchFunction,
      get: switches,
    };
  },

  saveSwitchToStorage: (key: string, val?: string) => {
    if (val) {
      localStorage.setItem('switch_' + key, val);
    } else {
      localStorage.removeItem('switch_' + key);
    }
  },
};

export default SaveDataManager;
