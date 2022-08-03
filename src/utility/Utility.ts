import { ExclamationIcon } from '@heroicons/react/outline';
import { AlertData } from '../types/AlertTypes';
import { Color, FilterOptions } from '../types/BaseTypes';
import { PlanErrorLocation } from '../types/ErrorTypes';
import { ScheduleDataMap, ScheduleDate, Time } from '../types/ScheduleTypes';

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

    convertTime: ({ h, m }: Time, withAmPm?: boolean) => {
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

    fitHours: (
        time: Time | undefined,
        current: number,
        end: boolean
    ): number => {
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
        for (let i = 0; i < 6; i++) {
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
            .map((section) => `${section.subject} ${section.number}`)
            .join(', '),

    prereqColor: (num: number) => {
        switch (num) {
            case 0:
                return 'red';
            case 1:
                return 'blue';
            case 2:
                return 'green';
            case 3:
                return 'yellow';
            case 4:
                return 'purple';
            default:
                return 'gray';
        }
    },

    errorAlert: (from: PlanErrorLocation, error: string): AlertData => {
        return {
            title: "Well, this isn't good...",
            message: `Oh nooo this wasn't supposed to happen. An unexpected error occurred.
                      Check out the site status to see if what you're experiencing is a known issue.
                      If it's not, please let me know. Make sure to note the error message below.`,
            confirmButton: 'View status',
            confirmButtonColor: 'red',
            cancelButton: 'Close',
            iconColor: 'red',
            icon: ExclamationIcon,
            textView: error + ' - ' + from,
            action: () => {
                window.open('https://status.dilanxd.com', '_blank');
            },
        };
    },

    generateRandomString: (length: number) => {
        let text = '';
        let possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        return text;
    },

    capitalizeFirstLetter: (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    getFilterColor: (filterName: keyof FilterOptions): Color => {
        switch (filterName) {
            case 'subject':
                return 'blue';
        }
    },

    parseTime: (text: string): Time | undefined => {
        let timeString = text.toLowerCase();
        const timeRegex = /^\d{1,2}:\d{1,2} ?(a|am|p|pm)?$/i;

        if (!timeRegex.test(timeString)) {
            return undefined;
        }

        const meridian = timeString.match(/[ap]/i)?.[0];
        let [h, m] = timeString
            .replace(/[ apm]/gi, '')
            .split(':')
            .map((p) => parseInt(p));
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
};

export default Utility;
