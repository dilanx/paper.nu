import Account from './Account';
import { AccountDataMap } from './types/AccountTypes';
import { LoadMethods, LoadResponse, UserOptions } from './types/BaseTypes';
import debug from 'debug';
import ScheduleManager from './ScheduleManager';
import { Mode } from './utility/Constants';
import { ScheduleData } from './types/ScheduleTypes';
import PlanManager from './PlanManager';
import { PlanData } from './types/PlanTypes';
var d = debug('save-data-manager');

function matchAccountId(accountData: AccountDataMap, content: string) {
    for (let id in accountData) {
        if (accountData[id].content === content) {
            return id;
        }
    }
}

function isValid<T>(response: T | 'malformed' | 'empty'): response is T {
    return response !== 'malformed' && response !== 'empty';
}

let SaveDataManager = {
    load: async (
        params: URLSearchParams,
        switches: UserOptions
    ): Promise<LoadResponse<PlanData | ScheduleData>> => {
        let activeId: string | undefined = undefined;
        let originalDataString: string = '';
        let accountPlans: AccountDataMap | undefined = undefined;
        let accountSchedules: AccountDataMap | undefined = undefined;
        let method: LoadMethods = 'None';

        if (Account.isLoggedIn()) {
            const accountInit = Account.init();
            accountPlans = await accountInit.plans;
            accountSchedules = await accountInit.schedule;
            activeId = 'None';
        }

        d('trying to load schedule URL data');
        let scheduleData = ScheduleManager.loadFromURL(params);
        if (scheduleData !== 'empty') {
            if (scheduleData !== 'malformed') {
                d('schedule URL load successful');
                method = 'URL';
                if (accountSchedules) {
                    let dataStr = params.toString();
                    let id = matchAccountId(accountSchedules, dataStr);
                    if (id) {
                        d('matched content to account schedule: %s', id);
                        activeId = id;
                        originalDataString = dataStr;
                        method = 'Account';
                    }
                }
                ScheduleManager.save(scheduleData);
                d('schedule data loaded');
            }
            const response: LoadResponse<ScheduleData> = {
                mode: Mode.SCHEDULE,
                data: scheduleData,
                activeId,
                originalDataString,
                method,
            };
            return response;
        }

        d('no schedule URL data to load, trying plan URL data instead');
        let planData = PlanManager.loadFromURL(params);
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
                PlanManager.save(planData);
                d('plan data loaded');
            }
            const response: LoadResponse<PlanData> = {
                mode: Mode.PLAN,
                data: planData,
                activeId,
                originalDataString,
                method,
            };
            return response;
        }

        d('nothing to load from URL');
        const mode = switches.get.mode as Mode;
        d('last mode used is %d', mode);

        if (switches.get.save_to_storage) {
            if (mode === Mode.PLAN) {
                d('trying to load plan data from account');
                let storedPlanId = switches.get.active_plan_id as
                    | string
                    | undefined;
                if (accountPlans && storedPlanId) {
                    if (storedPlanId in accountPlans) {
                        let content = accountPlans[storedPlanId].content;
                        let data = PlanManager.loadFromString(content);
                        if (data !== 'empty') {
                            if (data !== 'malformed') {
                                d(
                                    'account plan load successful: %s',
                                    storedPlanId
                                );
                                activeId = storedPlanId;
                                originalDataString = content;
                                PlanManager.save(data);
                                d('plan data loaded');
                            }
                            const response: LoadResponse<PlanData> = {
                                mode: Mode.PLAN,
                                data,
                                activeId,
                                originalDataString,
                                method: 'Account',
                            };
                            return response;
                        }
                    }
                }

                d('nothing to load from account, trying storage instead');
                let data = PlanManager.loadFromStorage();
                if (data !== 'empty') {
                    if (data !== 'malformed') {
                        PlanManager.save(data);
                        d('plan data loaded');
                    }
                    const response: LoadResponse<PlanData> = {
                        mode: Mode.PLAN,
                        data,
                        activeId,
                        originalDataString,
                        method: 'Storage',
                    };
                    return response;
                }
            } else if (mode === Mode.SCHEDULE) {
                let storedScheduleId = switches.get.active_schedule_id as
                    | string
                    | undefined;
                if (accountSchedules && storedScheduleId) {
                    if (storedScheduleId in accountSchedules) {
                        let content =
                            accountSchedules[storedScheduleId].content;
                        let data = ScheduleManager.loadFromString(content);
                        if (data !== 'empty') {
                            if (data !== 'malformed') {
                                d(
                                    'account scheedule load successful: %s',
                                    storedScheduleId
                                );
                                activeId = storedScheduleId;
                                originalDataString = content;
                                ScheduleManager.save(data);
                                d('schedule data loaded');
                            }
                            const response: LoadResponse<ScheduleData> = {
                                mode: Mode.SCHEDULE,
                                data,
                                activeId,
                                originalDataString,
                                method: 'Account',
                            };
                            return response;
                        }
                    }
                }

                d('nothing to load from account, trying storage instead');
                let data = ScheduleManager.loadFromStorage();
                if (data !== 'empty') {
                    if (data !== 'malformed') {
                        ScheduleManager.save(data);
                        d('schedule data loaded');
                    }
                    const response: LoadResponse<ScheduleData> = {
                        mode: Mode.SCHEDULE,
                        data,
                        activeId,
                        originalDataString,
                        method: 'Storage',
                    };
                    return response;
                }
            }
        }

        d('no data to load');
        return {
            mode,
            data: 'empty',
            activeId,
            originalDataString,
            method,
        };
    },
};

export default SaveDataManager;
