import localforage from 'localforage';
import { InfoSetData } from '../types/BaseTypes';
import { PlanDataCache } from '../types/PlanTypes';
import { ScheduleDataCache } from '../types/ScheduleTypes';
import Links from './StaticLinks';
import Utility from './Utility';

function getTime<T>(location: string, key: keyof T) {
  return async () => {
    const data: any = await localforage.getItem<T>(location);
    if (!data) {
      return 'unused';
    }
    return Utility.formatCacheVersion(
      data[key] as string | number,
      (data['termId'] as string) || '1'
    );
  };
}

export const INFO_VERSIONS: InfoSetData = [
  [
    'App Version',
    `${process.env.REACT_APP_VERSION || 'unknown'}-${
      process.env.REACT_APP_COMMIT || 'unknown'
    }`,
  ],
  [
    'API Version',
    async () => {
      const response = await fetch(Links.SERVER);
      const data = await response.json();
      return data.version;
    },
  ],
  ['Plan Cache Data Version', getTime<PlanDataCache>('plan', 'updated')],
  [
    'Schedule Cache 0 Storage Version',
    getTime<ScheduleDataCache>('schedule0', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 0 Data Version',
    getTime<ScheduleDataCache>('schedule0', 'dataUpdated'),
  ],
  [
    'Schedule Cache 1 Storage Version',
    getTime<ScheduleDataCache>('schedule1', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 1 Data Version',
    getTime<ScheduleDataCache>('schedule1', 'dataUpdated'),
  ],
  [
    'Schedule Cache 2 Storage Version',
    getTime<ScheduleDataCache>('schedule2', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 2 Data Version',
    getTime<ScheduleDataCache>('schedule2', 'dataUpdated'),
  ],
];
