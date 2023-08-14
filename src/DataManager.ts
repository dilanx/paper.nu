import { DataMapInformation } from './types/BaseTypes';
import localforage from 'localforage';
import debug from 'debug';
import { PlanDataCache, RawCourseData } from './types/PlanTypes';
import { ScheduleCourse, ScheduleDataCache } from './types/ScheduleTypes';
import { plan, schedule } from './utility/DataMap';
const d = debug('data-manager');

let info: DataMapInformation | undefined = undefined;

localforage.config({
  name: 'paper',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export function getTermName(termId: string) {
  return info?.terms[termId]?.name;
}

export function getTerms() {
  if (!info) return;
  return Object.keys(info.terms).map((termId) => ({
    value: termId,
    label: info?.terms[termId].name,
  }));
}

export function getTermInfo(termId: string) {
  if (!info) return;
  const termInfo = info.terms[termId];
  return {
    value: termId,
    label: termInfo.name,
    start: termInfo.start,
    end: termInfo.end,
  };
}

export async function getDataMapInformation() {
  d('data map information: get');
  if (info) {
    d('data map information: cache hit');
    return info;
  }

  d('data map information: cache miss, fetching data');
  const res = await fetch('https://api.dilanxd.com/paper/data');
  const json = await res.json();

  info = json as DataMapInformation;
  return info;
}

export async function getPlanData(): Promise<RawCourseData> {
  d('plan data: get');
  const info = await getDataMapInformation();
  const data = await localforage.getItem<PlanDataCache>('plan');
  if (data) {
    if (data.updated === info.plan) {
      d('plan data: cache hit');
      return plan(data.data);
    } else {
      d('plan data: cache out of date, fetching data');
    }
  } else {
    d('plan data: cache miss, fetching data');
  }

  const res = await fetch('https://cdn.dilanxd.net/paper-data/plan.json');
  const json = await res.json();

  await localforage.setItem('plan', {
    updated: info.plan,
    data: json,
  });

  return plan(json);
}

export async function getScheduleData(
  termId?: string
): Promise<{ termId: string; data: ScheduleCourse[] } | undefined> {
  d('schedule data: get');
  const info = await getDataMapInformation();

  if (!termId) {
    d('schedule data: no term id provided, using latest (%s)', info.latest);
    termId = info.latest;
  }

  if (!info.terms[termId]) {
    d('schedule data: term id not found');
    return;
  }

  const cacheLocations = ['schedule0', 'schedule1', 'schedule2'];
  let saveToCache = -1;
  let oldestCache = -1;
  let oldestTime = -1;
  let outOfDate = false;

  for (let i = 0; i < cacheLocations.length; i++) {
    const loc = cacheLocations[i];
    d('schedule data: checking cache %s', loc);
    const data = await localforage.getItem<ScheduleDataCache>(loc);
    if (data) {
      if (oldestCache < 0 || data.cacheUpdated < oldestTime) {
        oldestTime = data.cacheUpdated;
        oldestCache = i;
      }

      if (data.termId === termId) {
        if (data.dataUpdated === info.terms[termId].updated) {
          d('schedule data: cache hit');
          return {
            termId,
            data: schedule(data.data),
          };
        } else {
          d('schedule data: cache out of date, fetching data');
          saveToCache = i;
          outOfDate = true;
          break;
        }
      } else {
        d('schedule data: cache is for a different term, checking another');
      }
    } else {
      if (saveToCache < 0) saveToCache = i;
      d(
        `schedule data: cache empty${
          i === cacheLocations.length - 1
            ? ', all caches checked'
            : ', checking another'
        }`
      );
    }
  }

  if (saveToCache < 0) {
    d(
      'schedule data: all caches are full, fetching data and overwriting the oldest one (%s)',
      cacheLocations[oldestCache]
    );
    saveToCache = oldestCache;
  } else {
    if (!outOfDate) {
      d(
        'schedule data: cache miss, fetching data and storing in cache %s',
        cacheLocations[saveToCache]
      );
    }
  }

  const res = await fetch(`https://cdn.dilanxd.net/paper-data/${termId}.json`);
  const json = await res.json();

  await localforage.setItem<ScheduleDataCache>(cacheLocations[saveToCache], {
    termId: termId,
    dataUpdated: info.terms[termId].updated,
    data: json,
    cacheUpdated: Date.now(),
  });

  d(
    'schedule data: data fetched and stored in cache %s',
    cacheLocations[saveToCache]
  );
  return {
    termId,
    data: schedule(json),
  };
}

export async function clearCache() {
  const cacheLocations = ['plan', 'schedule0', 'schedule1', 'schedule2'];
  for (const loc of cacheLocations) {
    await localforage.removeItem(loc);
  }
}
