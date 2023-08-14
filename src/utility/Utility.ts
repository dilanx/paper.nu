import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { AlertData } from '../types/AlertTypes';
import { Color, InfoSetData } from '../types/BaseTypes';
import { PlanErrorLocation } from '../types/ErrorTypes';
import {
  ScheduleDataMap,
  ScheduleDate,
  SectionWithMeetingPattern,
  Time,
} from '../types/ScheduleTypes';
import { FilterBadgeName, FilterOptions } from '../types/SearchTypes';
import { Mode } from './Constants';
import { PaperError, PaperExpectedAuthError } from './PaperError';
import Account from '../Account';

let Utility = {
  BACKGROUND_LIGHT: '#FFFFFF',
  BACKGROUND_DARK: '#262626',

  getDistroAcronym: (distroString: string) => {
    let distro = distroString.split(' ');
    let acronym = '';
    distro.forEach((d) => (acronym += d[0]));
    return acronym;
  },

  convertDistros: (distros: string | undefined) => {
    let strings: string[] = [];

    if (!distros) return strings;

    for (let i = 0; i < distros.length; i++) {
      let d = parseInt(distros[i]);

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
  },

  convertYear: (num: number) => {
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
  },

  convertQuarter: (num: number): { title: string; color: Color } => {
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
  },

  getTermColor: (name: string): Color => {
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
  },

  convertAllDaysToString: (nums: string) => {
    let days = '';
    for (let i = 0; i < nums.length; i++) {
      days += Utility.convertDay(parseInt(nums[i]));
    }
    return days;
  },

  convertAllDaysToArray: (nums: string) => {
    let days = [];
    for (let i = 0; i < nums.length; i++) {
      days.push(Utility.convertDay(parseInt(nums[i])).toUpperCase());
    }
    return days;
  },

  convertDay: (num: number) => {
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
  },

  convertHour: (num: number) => {
    if (num < 12) {
      return num + ' AM';
    }
    return num - (num === 12 ? 0 : 12) + ' PM';
  },

  convertDate: (date: string): ScheduleDate => {
    const [y, m, d] = date.split('-').map((p) => parseInt(p));
    return { y, m: m - 1, d };
  },

  convertTime: ({ h, m }: Time, withAmPm = false) => {
    let pm = false;
    if (h > 12) {
      pm = true;
      h -= 12;
    }
    if (h === 12) {
      pm = true;
    }

    let time = h + ':' + (m < 10 ? '0' + m : m);

    if (withAmPm) {
      time += pm ? ' PM' : ' AM';
    }

    return time;
  },

  convertSectionComponent: (component: string) => {
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
      default:
        return component;
    }
  },

  fitHours: (time: Time | undefined, current: number, end: boolean): number => {
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
  },

  getClosestMeetingDate: (
    { y, m, d }: ScheduleDate,
    meetingDays: string
  ): ScheduleDate | undefined => {
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
  },

  timeInMinutes: ({ h, m }: Time) => h * 60 + m,

  timesOverlap: (
    time1Start: Time,
    time1End: Time,
    time2Start: Time,
    time2End: Time
  ) => {
    const startA = time1Start.h * 60 + time1Start.m;
    const endA = time1End.h * 60 + time1End.m;
    const startB = time2Start.h * 60 + time2Start.m;
    const endB = time2End.h * 60 + time2End.m;

    return startA <= endB && startB <= endA;
  },

  formatSections: (schedule: ScheduleDataMap) =>
    Object.values(schedule)
      .map(
        (section) =>
          `${section.subject}${section.number ? ` ${section.number}` : ''}`
      )
      .join(', '),

  errorAlert: (from: PlanErrorLocation, error: PaperError): AlertData => {
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
          Account.logOut();
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
          `https://kb.dilanxd.com/paper/troubleshooting?e=${encodeURIComponent(
            errorText
          )}`,
          '_blank'
        );
      },
    };
  },

  generateRandomString: (length: number) => {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },

  capitalizeFirstLetter: (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  filterBelongsTo: (option: keyof FilterOptions, mode: Mode) => {
    switch (option) {
      case 'subject':
      case 'distros':
        return true;
      case 'unitGeq':
      case 'unitLeq':
      case 'include':
        return mode === Mode.PLAN;
      case 'startAfter':
      case 'startBefore':
      case 'endAfter':
      case 'endBefore':
      case 'meetingDays':
      case 'components':
      case 'instructor':
      case 'location':
        return mode === Mode.SCHEDULE;
      default:
        return false;
    }
  },

  getFilterBadgeInfo: (
    filterBadgeName: FilterBadgeName
  ): [Color, 'p' | 's' | 'b'] => {
    switch (filterBadgeName) {
      case 'subject':
        return ['blue', 'b'];
      case 'start':
        return ['green', 's'];
      case 'end':
        return ['red', 's'];
      case 'meeting days':
        return ['fuchsia', 's'];
      case 'components':
        return ['amber', 's'];
      case 'instructor':
        return ['pink', 's'];
      case 'location':
        return ['lime', 's'];
      case 'distros':
        return ['teal', 'b'];
      case 'units':
        return ['purple', 'p'];
      case 'include':
        return ['violet', 'p'];
      default:
        return ['gray', 'b'];
    }
  },

  parseTime: (text?: string): Time | undefined => {
    if (!text) return;
    let timeString = text.toLowerCase();
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
  },

  timeCompare: (time1: Time, time2: Time) => {
    if (time1.h === time2.h) {
      return time1.m - time2.m;
    }
    return time1.h - time2.h;
  },

  cleanEnrollmentRequirements: (text?: string) => {
    if (text?.toLowerCase().startsWith('enrollment requirements: ')) {
      return text.substring(25);
    }
    return text;
  },

  forAllChildElements: (
    root: React.ReactNode,
    callback: (element: React.ReactElement) => void
  ) => {
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
  },

  safe: (value: any): any | undefined => {
    if (value) return value;
  },

  safeNumber: (value: any): number | undefined => {
    if (value) return parseFloat(value);
  },

  safeArrayCommaSplit: (value: any): any[] | undefined => {
    if (value) {
      const sp = value.split(',');
      if (sp.length > 0) return sp;
    }
  },

  getPlaceholderInfoSet: (data: InfoSetData): InfoSetData<string> => {
    const newData: InfoSetData<string> = [];
    for (const [k, v] of data) {
      newData.push([k, typeof v === 'string' ? v : '-']);
    }
    return newData;
  },

  initializeInfoSet: async (
    data: InfoSetData
  ): Promise<InfoSetData<string>> => {
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
  },

  formatCacheVersion: (time: number | string, termId?: string) => {
    let t = new Date(typeof time === 'string' ? parseInt(time) : time);
    const d = t.getDate();
    const m = t.getMonth() + 1;
    const y = t.getFullYear();
    const h = t.getHours();
    const min = t.getMinutes();
    const s = t.getSeconds();

    const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    return `${termId ? `${termId}-` : ''}${y}.${p(m)}.${p(d)}-${p(h)}${p(
      min
    )}${p(s)}`;
  },

  sectionMeetingPatternIsValid: (swmp: SectionWithMeetingPattern) => {
    const { start_time, end_time, meeting_days } = swmp;
    return start_time && end_time && meeting_days;
  },

  isStringEntirelyANumber: (str: string) => {
    return /^\d+$/.test(str);
  },

  friendlyEasterEgg: (text: string) => {
    if (text === 'naomi') {
      return ['Hmm?', "Wait what's going on?"];
    }

    return null;
  },
};

export default Utility;
