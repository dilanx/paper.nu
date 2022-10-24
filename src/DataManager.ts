import { DataMapInformation } from './types/BaseTypes';
import localforage from 'localforage';
import debug from 'debug';
import { PlanDataCache, RawCourseData } from './types/PlanTypes';
import { ScheduleCourse, ScheduleDataCache } from './types/ScheduleTypes';
import { plan, schedule } from './utility/DataMap';
var d = debug('data-manager');

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
  return {
    value: termId,
    label: info.terms[termId].name,
  };
}

export async function getDataMapInformation() {
  d('data map information: get');
  if (info) {
    d('data map information: cache hit');
    return info;
  }

  d('data map information: cache miss, fetching data');
  const res = await fetch('https://auth.dilanxd.com/plan-nu/data');
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

  const res = await fetch('https://cdn.dilanxd.com/paper-data/plan.json');
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

  const data = await localforage.getItem<ScheduleDataCache>('schedule');
  if (data) {
    if (data.termId === termId) {
      if (data.updated === info.terms[termId].updated) {
        d('schedule data: cache hit');
        return {
          termId,
          data: schedule(data.data),
        };
      } else {
        d('schedule data: cache out of date, fetching data');
      }
    } else {
      d('schedule data: cache is for a different term, fetching data');
    }
  } else {
    d('schedule data: cache miss, fetching data');
  }

  const res = await fetch(`https://cdn.dilanxd.com/paper-data/${termId}.json`);
  const json = await res.json();

  await localforage.setItem('schedule', {
    termId: termId,
    updated: info.terms[termId].updated,
    data: json,
  });
  return {
    termId,
    data: schedule(json),
  };
}
