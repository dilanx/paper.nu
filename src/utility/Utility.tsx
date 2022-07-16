import { ExclamationIcon } from '@heroicons/react/outline';
import { AlertData } from '../types/AlertTypes';
import {
    Color,
    ReadUserOptions,
    UserOptions,
    UserOptionValue,
} from '../types/BaseTypes';
import { PlanErrorLocation } from '../types/ErrorTypes';
import { Time } from '../types/ScheduleTypes';

let Utility = {
    BACKGROUND_LIGHT: '#FFFFFF',
    BACKGROUND_DARK: '#262626',

    loadSwitchesFromStorage: (
        setSwitchFunction: (
            key: string,
            val: UserOptionValue,
            save: boolean | undefined
        ) => void
    ): UserOptions => {
        let switches: ReadUserOptions = {
            save_to_storage: true,
            notifications: true,
            settings_tab: 'Appearance',
            mode: 1,
        };
        let keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('switch_')) {
                let store = localStorage.getItem(keys[i]);
                let val: UserOptionValue = undefined;
                if (store != null) {
                    if (store === 'true') val = true;
                    else if (store === 'false') val = false;
                    else if (isNaN(parseInt(store))) val = parseInt(store);
                    else val = store;
                }
                let switchId = keys[i].substring(7);
                switches[switchId] = val;
            }
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

    convertAllDays: (nums: string) => {
        let days = '';
        for (let i = 0; i < nums.length; i++) {
            days += Utility.convertDay(parseInt(nums[i]));
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
                return 'LECTURE';
            case 'DIS':
                return 'DISCUSSION';
            case 'LAB':
                return 'LAB';
            case 'SEM':
                return 'SEMINAR';
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
            iconBackgroundColor: 'red',
            icon: (
                <ExclamationIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                />
            ),
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
};

export default Utility;
