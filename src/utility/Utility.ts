import { logout } from '@/app/Account';
import { AlertData, AlertDataExtra } from '@/types/AlertTypes';
import { Color, InfoSetData, UniversityQuarter } from '@/types/BaseTypes';
import { PlanErrorLocation } from '@/types/ErrorTypes';
import {
  ScheduleDataMap,
  ScheduleDate,
  SectionWithMeetingPattern,
  Time,
} from '@/types/ScheduleTypes';
import { FilterBadgeName } from '@/types/SearchTypes';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React, { ReactElement, ReactNode } from 'react';
import { PaperError, PaperExpectedAuthError } from './PaperError';
import Links from './StaticLinks';

export const BACKGROUND_LIGHT = '#ffffff';
export const BACKGROUND_DARK = '#262626';

export function getDistroAcronym(distroString: string) {
  const distro = distroString.split(' ');
  let acronym = '';
  distro.forEach((d) => (acronym += d[0]));
  return acronym;
}

export function convertDistros(distros: string | undefined) {
  const strings: string[] = [];

  if (!distros) return strings;

  for (let i = 0; i < distros.length; i++) {
    const d = parseInt(distros[i]);

    switch (d) {
      case 1:
        strings.push('Natural Sciences');
        break;
      case 2:
        strings.push('Formal Studies');
        break;
      case 3:
        strings.push('Social and Behavioral Sciences');
        break;
      case 4:
        strings.push('Historical Studies');
        break;
      case 5:
        strings.push('Ethics and Values');
        break;
      case 6:
        strings.push('Literature and Fine Arts');
        break;
      case 7:
        strings.push('Interdisciplinary Studies');
        break;
      default:
        strings.push('Unknown');
        break;
    }
  }

  return strings;
}

export function convertDisciplines(disciplines: string | undefined) {
  const strings: string[] = [];

  if (!disciplines) return strings;

  for (let i = 0; i < disciplines.length; i++) {
    const d = parseInt(disciplines[i]);

    switch (d) {
      case 1:
        strings.push('Natural Sciences');
        break;
      case 2:
        strings.push('Empirical and Deductive Reasoning');
        break;
      case 3:
        strings.push('Social and Behavioral Sciences');
        break;
      case 4:
        strings.push('Historical Studies');
        break;
      case 5:
        strings.push('Ethical and Evaluative Thinking');
        break;
      case 6:
        strings.push('Literature and Arts');
        break;
      case 7:
        strings.push('Interdisciplinary');
        break;
      default:
        strings.push('Unknown');
        break;
    }
  }

  return strings;
}

export function convertYear(num: number) {
  switch (num) {
    case 0:
      return 'FIRST YEAR';
    case 1:
      return 'SECOND YEAR';
    case 2:
      return 'THIRD YEAR';
    case 3:
      return 'FOURTH YEAR';
    case 4:
      return 'FIFTH YEAR';
    case 5:
      return 'SIXTH YEAR';
    case 6:
      return 'SEVENTH YEAR';
    case 7:
      return 'EIGHTH YEAR';
    case 8:
      return 'NINTH YEAR';
    case 9:
      return 'TENTH YEAR';
    default:
      return 'AAH TOO MANY YEARS NOOOO';
  }
}

export function convertQuarter(num: number): { title: string; color: Color } {
  switch (num) {
    case 0:
      return { title: 'FALL', color: 'orange' };
    case 1:
      return { title: 'WINTER', color: 'sky' };
    case 2:
      return { title: 'SPRING', color: 'lime' };
    case 3:
      return { title: 'SUMMER', color: 'yellow' };
    default:
      return { title: 'LOL WHAT??', color: 'gray' };
  }
}

export function getTermColor(name: string): Color {
  name = name.toLowerCase();
  if (name.includes('fall')) {
    return 'orange';
  }
  if (name.includes('winter')) {
    return 'sky';
  }
  if (name.includes('spring')) {
    return 'lime';
  }
  if (name.includes('summer')) {
    return 'yellow';
  }
  return 'gray';
}

export function getCurrentTime(useCentralTime: boolean) {
  return useCentralTime
    ? new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
      )
    : new Date();
}

export function convertAllDaysToString(nums: string) {
  let days = '';
  for (let i = 0; i < nums.length; i++) {
    days += convertDay(parseInt(nums[i]));
  }
  return days;
}

export function convertAllDaysToArray(nums: string) {
  const days = [];
  for (let i = 0; i < nums.length; i++) {
    days.push(convertDay(parseInt(nums[i])).toUpperCase());
  }
  return days;
}

export function convertDay(num: number) {
  switch (num) {
    case 0:
      return 'Mo';
    case 1:
      return 'Tu';
    case 2:
      return 'We';
    case 3:
      return 'Th';
    case 4:
      return 'Fr';
    default:
      return '??';
  }
}

export function convertHour(num: number) {
  if (num < 12) {
    return num + ' AM';
  }
  return num - (num === 12 ? 0 : 12) + ' PM';
}

export function convertDateString(date: string): ScheduleDate {
  const [y, m, d] = date.split('-').map((p) => parseInt(p));
  return { y, m: m - 1, d };
}

export function convertDate({ y, m, d }: ScheduleDate) {
  return `${y}-${(m + 1).toString().padStart(2, '0')}-${d
    .toString()
    .padStart(2, '0')}`;
}

export function convertTime({ h, m }: Time, withAmPm = false) {
  let pm = false;
  if (h > 12) {
    pm = true;
    h -= 12;
  }
  if (h === 0) {
    h = 12;
  } else if (h === 12) {
    pm = true;
  }

  let time = h + ':' + (m < 10 ? '0' + m : m);

  if (withAmPm) {
    time += pm ? ' PM' : ' AM';
  }

  return time;
}

export function convertSectionComponent(component: string) {
  switch (component) {
    case 'LEC':
      return 'lecture';
    case 'DIS':
      return 'discussion';
    case 'LAB':
      return 'lab';
    case 'SEM':
      return 'seminar';
    case 'PED':
      return 'performance';
    case 'CUS':
      return 'custom';
    default:
      return component;
  }
}

export function fitHours(
  time: Time | undefined,
  current: number,
  end: boolean
) {
  if (!time) {
    return current;
  }
  if (end) {
    if (time.h >= current) {
      current = time.h + (time.m > 0 ? 1 : 0);
    }
    return current;
  }
  if (time.h < current) {
    current = time.h;
  }
  return current;
}

export function getClosestMeetingDate(
  { y, m, d }: ScheduleDate,
  meetingDays: string
): ScheduleDate | undefined {
  const date = new Date(y, m, d);
  for (let i = 0; i < 7; i++) {
    const day = date.getDay() - 1;
    if (meetingDays.includes(day.toString())) {
      return {
        y: date.getFullYear(),
        m: date.getMonth(),
        d: date.getDate(),
      };
    }
    date.setDate(date.getDate() + 1);
  }
}

export function timeInMinutes({ h, m }: Time) {
  return h * 60 + m;
}

export function timesOverlap(
  time1Start: Time,
  time1End: Time,
  time2Start: Time,
  time2End: Time
) {
  const startA = time1Start.h * 60 + time1Start.m;
  const endA = time1End.h * 60 + time1End.m;
  const startB = time2Start.h * 60 + time2Start.m;
  const endB = time2End.h * 60 + time2End.m;

  return startA <= endB && startB <= endA;
}

export function formatSections(schedule: ScheduleDataMap) {
  return Object.values(schedule)
    .map(
      (section) =>
        `${section.subject}${section.number ? ` ${section.number}` : ''}`
    )
    .join(', ');
}

export function errorAlert(
  from: PlanErrorLocation,
  error: PaperError
): AlertData {
  if (error instanceof PaperExpectedAuthError) {
    const errorText = error.name + ': ' + error.message + ' - ' + from;
    return {
      title: 'Action Forbidden',
      subtitle: 'Try logging out and logging back in.',
      message:
        'Paper was forbidden from performing the action you requested. This can happen if the required permissions on the server have changed. This is nothing to worry about though. Log out using the button below, then log in again. Things should hopefully work.',
      confirmButton: 'Log out',
      cancelButton: 'Close',
      color: 'red',
      textView: {
        text: errorText,
      },
      icon: ExclamationTriangleIcon,
      action: () => {
        logout();
      },
    };
  }

  const errorText = error.name + ': ' + error.message + ' - ' + from;
  return {
    title: "Well, this isn't good...",
    message: `Oh nooo this wasn't supposed to happen. An unexpected error occurred. You can troubleshoot this error or try again later.`,
    confirmButton: 'Troubleshoot this error',
    cancelButton: 'Close',
    color: 'red',
    icon: ExclamationTriangleIcon,
    textView: {
      text: errorText,
    },
    action: () => {
      window.open(
        `${Links.SUPPORT_ERROR}?e=${encodeURIComponent(errorText)}`,
        '_blank'
      );
    },
  };
}

export function generateRandomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getFilterBadgeInfo(
  filterBadgeName: FilterBadgeName
): [Color, 'p' | 's' | 'b'] {
  switch (filterBadgeName) {
    case 'subject':
      return ['blue', 'b'];
    case 'meeting days':
      return ['fuchsia', 's'];
    case 'start':
      return ['green', 's'];
    case 'end':
      return ['red', 's'];
    case 'time slots':
      return ['pink', 's'];
    case 'components':
      return ['amber', 's'];
    case 'instructor':
      return ['pink', 's'];
    case 'location':
      return ['lime', 's'];
    case 'distros':
      return ['teal', 'b'];
    case 'fd':
      return ['teal', 'b'];
    case 'units':
      return ['purple', 'p'];
    case 'include':
      return ['violet', 'p'];
    default:
      return ['gray', 'b'];
  }
}

export function parseTime(text?: string): Time | undefined {
  if (!text) return undefined;
  const timeString = text.toLowerCase();
  const timeRegex = /^\d{1,2}(:\d{1,2})? ?(a|am|p|pm)?$/i;

  if (!timeRegex.test(timeString)) {
    return undefined;
  }

  const meridian = timeString.match(/[ap]/i)?.[0];
  let [h, m] = timeString
    .replace(/[ apm]/gi, '')
    .split(':')
    .map((p) => parseInt(p));
  if (!m) {
    m = 0;
  }
  if (isNaN(h) || isNaN(m)) {
    return undefined;
  }
  if (meridian === 'p') {
    if (h > 12) return;
    if (h < 12) h += 12;
  }
  if (meridian === 'a') {
    if (h > 12) return;
    if (h === 12) h = 0;
  }

  if (h < 0 || m < 0) {
    return undefined;
  }

  if (h > 23 || m > 59) {
    return undefined;
  }

  return { h, m };
}

export function parseDate(text?: string): ScheduleDate | undefined {
  if (!text) return undefined;
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/i;

  if (!dateRegex.test(text)) {
    return undefined;
  }

  const [y, m, d] = text.split('-').map((p) => parseInt(p));
  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return undefined;
  }

  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return undefined;
  }

  if (m === 2 && (y % 4 === 0 ? d > 29 : d > 28)) {
    return undefined;
  }

  if ((m === 4 || m === 6 || m === 9 || m === 11) && d > 30) {
    return undefined;
  }

  return { y, m: m - 1, d };
}

export function timeCompare(time1: Time, time2: Time) {
  if (time1.h === time2.h) {
    return time1.m - time2.m;
  }
  return time1.h - time2.h;
}

export function cleanEnrollmentRequirements(text?: string) {
  if (text?.toLowerCase().startsWith('enrollment requirements: ')) {
    return text.substring(25);
  }
  return text;
}

export function forAllChildElements(
  root: ReactNode,
  callback: (element: ReactElement) => void
) {
  function rec(element: React.ReactNode) {
    if (React.isValidElement(element)) {
      callback(element);
    }
    const children = (element as any).props?.children;
    if (children) {
      React.Children.forEach(children, rec);
    }
  }
  React.Children.forEach(root, rec);
}

export function safe(value: any): any | undefined {
  if (value) return value;
}

export function safeNumber(value: any): number | undefined {
  if (value) return parseFloat(value);
}

export function safeArrayCommaSplit(value: any): any[] | undefined {
  if (value) {
    const sp = value.split(',');
    if (sp.length > 0) return sp;
  }
}

export function getPlaceholderInfoSet(data: InfoSetData) {
  const newData: InfoSetData<string> = [];
  for (const [k, v] of data) {
    newData.push([k, typeof v === 'string' ? v : '-']);
  }
  return newData;
}

export async function initializeInfoSet(data: InfoSetData) {
  const newData: InfoSetData<string> = [];
  for (const [k, v] of data) {
    if (typeof v === 'string') {
      newData.push([k, v]);
      continue;
    }

    let res: string;
    try {
      res = await v();
    } catch (e) {
      res = 'error';
    }
    newData.push([k, res]);
  }
  return newData;
}

export function formatCacheVersion(time: number | string, prefix: string) {
  const t = new Date(typeof time === 'string' ? parseInt(time) : time);
  const d = t.getUTCDate();
  const m = t.getUTCMonth() + 1;
  const y = t.getUTCFullYear();
  const h = t.getUTCHours();
  const min = t.getUTCMinutes();
  const s = t.getUTCSeconds();

  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return `${prefix}.${y}.${p(m)}.${p(d)}.${p(h)}.${p(min)}.${p(s)}`;
}

export function sectionMeetingPatternIsValid(swmp: SectionWithMeetingPattern) {
  const { start_time, end_time, meeting_days } = swmp;
  return start_time && end_time && meeting_days;
}

export function isStringEntirelyAnumber(str: string) {
  return /^\d+$/.test(str);
}

export function shallowEqual(obj1: any, obj2: any) {
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(
      (key) =>
        Object.prototype.hasOwnProperty.call(obj2, key) &&
        obj1[key] === obj2[key]
    )
  );
}

export function getAcadYear(year: number, quarter: UniversityQuarter) {
  switch (quarter) {
    case 'Fall':
      return `${year}-${year + 1}`;
    case 'Winter':
    case 'Spring':
    case 'Summer':
      return `${year - 1}-${year}`;
  }
}

export function objAsAlertExtras(
  obj: { [key: string]: string | string[] },
  sortFn: (a: string, b: string) => number = (a, b) => a.localeCompare(b),
  mapFn?: (key: string) => string
) {
  const extras: AlertDataExtra[] = [];
  const keys = Object.keys(obj).sort(sortFn);

  for (const title of keys) {
    const content = obj[title];
    extras.push({
      title: mapFn ? mapFn(title) : title,
      content: typeof content === 'string' ? content : content.join(', '),
    });
  }
  return extras;
}
