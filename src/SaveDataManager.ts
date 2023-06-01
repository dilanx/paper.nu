import debug from 'debug';
import Account from './Account';
import { getDataMapInformation } from './DataManager';
import PlanManager from './PlanManager';
import ScheduleManager from './ScheduleManager';
import { Document } from './types/AccountTypes';
import {
  LoadMethods,
  LoadResponse,
  ReadUserOptions,
  UserOptions,
} from './types/BaseTypes';
import { PlanData } from './types/PlanTypes';
import { ScheduleData } from './types/ScheduleTypes';
import { Mode } from './utility/Constants';
const d = debug('save-data-manager');

const DEFAULT_SWITCHES: ReadUserOptions = {
  notifications: true,
  settings_tab: 'General',
  mode: Mode.PLAN,
  schedule_warnings: true,
  minimap: true,
};

function matchAccountId(accountData: Document[], content: string) {
  for (let doc of accountData) {
    if (doc.content === content) {
      return doc.id;
    }
  }
}

let SaveDataManager = {
  load: async (
    switches: UserOptions,
    hash?: string,
    params?: URLSearchParams
  ): Promise<LoadResponse<PlanData | ScheduleData>> => {
    let activeId: string | undefined = undefined;
    let originalDataString: string = '';
    let accountPlans: Document[] | undefined = undefined;
    let accountSchedules: Document[] | undefined = undefined;
    let method: LoadMethods = 'None';
    const latestTermId = (await getDataMapInformation()).latest;

    if (Account.isLoggedIn()) {
      const accountInit = await Account.init();
      accountPlans = accountInit.plans;
      accountSchedules = accountInit.schedules;
      activeId = 'None';
    }

    if (hash) {
      d('hash short code %s detected, trying to load', hash);
      if (hash.length !== 13) {
        d('hash is not 13 chars (# + 12), not a short code');
        return {
          mode: Mode.PLAN,
          data: 'malformed',
          originalDataString,
          method: 'URL',
          latestTermId,
        };
      }
      d('fetching content for short code from server');
      const scContentResponse = await fetch(
        `${Account.SERVER}/paper/shorten/${hash.slice(1)}`
      );
      if (!scContentResponse.ok) {
        d('failed to fetch short code with error %s', scContentResponse.status);
        return {
          mode: Mode.PLAN,
          data: 'malformed',
          originalDataString,
          method: 'URL',
          latestTermId,
        };
      }
      const scContent = await scContentResponse.json();
      params = new URLSearchParams(scContent.content);
      d('fetched content for short code and loaded it into params');
    }

    if (params) {
      d('trying to load schedule URL data');
      let scheduleData = await ScheduleManager.loadFromURL(params);
      if (scheduleData !== 'empty') {
        if (scheduleData !== 'malformed') {
          d('schedule URL load successful');
          method = 'URL';
          if (!params.has('s') && !params.has('sf')) {
            d('no content, just term change');
            method = 'TermChange';
          } else if (accountSchedules) {
            let dataStr = params.toString();
            let id = matchAccountId(accountSchedules, dataStr);
            if (id) {
              d('matched content to account schedule: %s', id);
              activeId = id;
              originalDataString = dataStr;
              method = 'Account';
            }
          }
          ScheduleManager.save(scheduleData, switches);
          d('schedule data loaded');
        }
        const response: LoadResponse<ScheduleData> = {
          mode: Mode.SCHEDULE,
          data: scheduleData,
          activeId,
          originalDataString,
          method,
          latestTermId,
        };
        return response;
      }

      d('no schedule URL data to load, trying plan URL data instead');
      let planData = await PlanManager.loadFromURL(params);
      if (planData !== 'empty') {
        if (planData !== 'malformed') {
          d('plan URL load successful');
          method = 'URL';
          if (accountPlans) {
            let dataStr = params.toString();
            let id = matchAccountId(accountPlans, dataStr);
            if (id) {
              d('matched content to account plan: %s', id);
              activeId = id;
              originalDataString = dataStr;
              method = 'Account';
            }
          }
          PlanManager.save(planData, switches);
          d('plan data loaded');
        }
        const response: LoadResponse<PlanData> = {
          mode: Mode.PLAN,
          data: planData,
          activeId,
          originalDataString,
          method,
          latestTermId,
        };
        return response;
      }

      d('nothing to load from URL');
    }
    const mode = switches.get.mode as Mode;
    d('last mode used is %d', mode);

    if (mode === Mode.PLAN) {
      d('trying to load plan data from account');
      let storedPlanId = switches.get.active_plan_id;
      if (accountPlans && storedPlanId) {
        const doc = accountPlans.find((doc) => doc.id === storedPlanId);
        if (doc) {
          let content = doc.content;
          let data = await PlanManager.loadFromString(content);
          if (data !== 'empty') {
            if (data !== 'malformed') {
              d('account plan load successful: %s', storedPlanId);
              activeId = storedPlanId;
              originalDataString = content;
              PlanManager.save(data, switches);
              d('plan data loaded');
            }
            const response: LoadResponse<PlanData> = {
              mode: Mode.PLAN,
              data,
              activeId,
              originalDataString,
              method: 'Account',
              latestTermId,
            };
            return response;
          }
        }
      }

      d('nothing to load from account, trying storage instead');
      let data = await PlanManager.loadFromStorage();
      if (data !== 'empty') {
        if (data !== 'malformed') {
          d('plan storage load successful');
          method = 'Storage';
          if (accountPlans) {
            let dataStr = PlanManager.getDataString(data);
            let id = matchAccountId(accountPlans, dataStr);
            if (id) {
              d('matched content to account plan: %s', id);
              activeId = id;
              originalDataString = dataStr;
              method = 'Account';
            }
          }
          PlanManager.save(data, switches);
          d('plan data loaded');
        }
        const response: LoadResponse<PlanData> = {
          mode: Mode.PLAN,
          data,
          activeId,
          originalDataString,
          method,
          latestTermId,
        };
        return response;
      }
    } else if (mode === Mode.SCHEDULE) {
      d('trying to load schedule data from account');
      let storedScheduleId = switches.get.active_schedule_id;
      if (accountSchedules && storedScheduleId) {
        const doc = accountSchedules.find((doc) => doc.id === storedScheduleId);
        if (doc) {
          let content = doc.content;
          let data = await ScheduleManager.loadFromString(content);
          if (data !== 'empty') {
            if (data !== 'malformed') {
              d('account schedule load successful: %s', storedScheduleId);
              activeId = storedScheduleId;
              originalDataString = content;
              ScheduleManager.save(data, switches);
              d('schedule data loaded');
            }
            const response: LoadResponse<ScheduleData> = {
              mode: Mode.SCHEDULE,
              data,
              activeId,
              originalDataString,
              method: 'Account',
              latestTermId,
            };
            return response;
          }
        }
      }

      d('nothing to load from account, trying storage instead');
      let data = await ScheduleManager.loadFromStorage();
      if (data !== 'empty') {
        if (data !== 'malformed') {
          d('schedule storage load successful');
          method = 'Storage';
          if (accountPlans) {
            let dataStr = ScheduleManager.getDataString(data);
            let id = matchAccountId(accountPlans, dataStr);
            if (id) {
              d('matched content to account schedule: %s', id);
              activeId = id;
              originalDataString = dataStr;
              method = 'Account';
            }
          }
          ScheduleManager.save(data, switches);
          d('schedule data loaded');
        }
        const response: LoadResponse<ScheduleData> = {
          mode: Mode.SCHEDULE,
          data,
          activeId,
          originalDataString,
          method,
          latestTermId,
        };
        return response;
      }
    }

    d('no data to load');
    return {
      mode,
      data: 'empty',
      activeId,
      originalDataString,
      method,
      latestTermId,
    };
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
          else if (!isNaN(parseInt(store))) val = parseInt(store);
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
