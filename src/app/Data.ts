import debug from 'debug';
import localforage from 'localforage';
import {
  DataMapInformation,
  OrganizedTerms,
  SubjectDataCache,
  SubjectsAndSchools,
} from '@/types/BaseTypes';
import { PlanDataCache, RawCourseData } from '@/types/PlanTypes';
import {
  ScheduleCourse,
  ScheduleDataCache,
  TermInfo,
} from '@/types/ScheduleTypes';
import { plan, schedule, subjectsAndSchools } from '@/utility/DataMap';
import Links from '@/utility/StaticLinks';
const d = debug('data-manager');

let info: DataMapInformation | undefined = undefined;

localforage.config({
  name: 'paper',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export const QUARTERS: { [quarter: string]: number } = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

export function getLatestTermId() {
  return info?.latest;
}

export function getTermName(termId: string) {
  return info?.terms[termId]?.name;
}

export function getTerms(): TermInfo[] | undefined {
  if (!info) return;
  return Object.keys(info.terms).map((termId) => ({
    id: termId,
    name: info?.terms[termId].name,
  }));
}

export function getOrganizedTerms(): OrganizedTerms | undefined {
  if (!info) return;
  const organizedTerms: OrganizedTerms = {};

  const termIds = Object.keys(info.terms);
  for (const termId of termIds) {
    const termInfo = info.terms[termId];
    const [year, quarter] = termInfo.name.split(' ');
    if (!organizedTerms[year]) {
      organizedTerms[year] = {
        Winter: null,
        Spring: null,
        Summer: null,
        Fall: null,
      };
    }

    organizedTerms[year][quarter] = termId;
  }

  return organizedTerms;
}

export function getTermInfo(termId?: string) {
  if (!info || !termId) return;
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
  const res = await fetch(`${Links.SERVER}/paper/data`);
  const json = await res.json();

  info = json as DataMapInformation;
  return info;
}

export async function getSubjectData(): Promise<SubjectsAndSchools> {
  d('subject data: get');
  const info = await getDataMapInformation();
  const data = await localforage.getItem<SubjectDataCache>('subjects');
  if (data) {
    if (data.updated === info.subjects) {
      d('subject data: cache hit');
      return subjectsAndSchools(data.data);
    } else {
      d('subject data: cache out of date, fetching data');
    }
  } else {
    d('subject data: cache miss, fetching data');
  }

  const res = await fetch('https://api.dilanxd.com/paper/subjects');
  const json = await res.json();

  await localforage.setItem('subjects', {
    updated: info.subjects,
    data: json.subjects,
  });

  d('subject data: data fetched and stored in cache subjects');

  return subjectsAndSchools(json.subjects);
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

  const res = await fetch('https://cdn.dil.sh/paper-data/plan.json');
  const json = await res.json();

  await localforage.setItem('plan', {
    updated: info.plan,
    data: json,
  });

  d('plan data: data fetched and stored in cache plan');

  return plan(json);
}

export async function getScheduleData(
  termId?: string,
  lockedTermId?: string
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
        if (
          lockedTermId &&
          data.termId === lockedTermId &&
          data.termId !== termId
        ) {
          d(
            'schedule data: cache is for locked term %s, skipping (%s)',
            lockedTermId,
            cacheLocations[i]
          );
          continue;
        }
        oldestTime = data.cacheUpdated;
        oldestCache = i;
      }

      if (data.termId === termId) {
        if (data.dataUpdated === info.terms[termId].updated) {
          d('schedule data: cache hit');
          return {
            termId,
            data: schedule(data.data, termId),
          };
        } else if (lockedTermId && data.termId === lockedTermId) {
          d(
            'schedule data: cache hit, requires update but is locked, skipping update'
          );
          return {
            termId,
            data: schedule(data.data, termId),
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

  const res = await fetch(`https://cdn.dil.sh/paper-data/${termId}.json`);
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
    data: schedule(json, termId),
  };
}

export async function clearCache() {
  d('clearing course data cache');
  const cacheLocations = [
    'subjects',
    'plan',
    'schedule0',
    'schedule1',
    'schedule2',
  ];
  for (const loc of cacheLocations) {
    await localforage.removeItem(loc);
  }
  d('course data cache cleared');
}

export async function clearRatingsCache() {
  d('clearing ratings cache');
  const keys = await localforage.keys();
  for (const key of keys) {
    if (key.startsWith('ratings.')) {
      await localforage.removeItem(key);
    }
  }
  d('ratings cache cleared');
}
