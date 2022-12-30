import PlanManager from '../PlanManager';
import ScheduleManager from '../ScheduleManager';
import {
  AlertFormFieldMultiSelect,
  AlertFormFieldText,
  AlertFormFieldTime,
  AlertFormSection,
} from '../types/AlertTypes';
import { TextValidator } from '../types/BaseTypes';
import { Time } from '../types/ScheduleTypes';
import { FilterOptions } from '../types/SearchTypes';
import { Components, Days, Distros } from './Constants';
import Utility from './Utility';

export function scheduleSearchFilterForm(
  filter: FilterOptions
): AlertFormSection[] {
  const text = (
    name: string,
    placeholder: string,
    current?: string,
    validator?: TextValidator
  ): AlertFormFieldText => ({
    name,
    type: 'text',
    placeholder,
    defaultValue: current,
    validator,
  });
  const time = (
    name: string,
    placeholder: string,
    current?: Time
  ): AlertFormFieldTime => ({
    name,
    type: 'time',
    placeholder,
    defaultValue: current ? Utility.convertTime(current, true) : undefined,
  });
  const sel = (
    name: string,
    options: string[],
    current?: string[]
  ): AlertFormFieldMultiSelect => ({
    name,
    type: 'multi-select',
    options,
    defaultValue: current?.join(','),
  });

  return [
    {
      title: 'SUBJECT',
      fullRow: true,
      fields: [
        text('subject', 'ex. COMP_SCI', filter.subject, (value) =>
          ScheduleManager.isSchoolSubject(value.toUpperCase())
        ),
      ],
    },
    {
      title: 'START AFTER',
      fields: [time('startAfter', 'ex. 10:00 am', filter.startAfter)],
    },
    {
      title: 'START BEFORE',
      fields: [time('startBefore', 'ex. 1:00 pm', filter.startBefore)],
    },
    {
      title: 'END AFTER',
      fields: [time('endAfter', 'ex. 11:00 am', filter.endAfter)],
    },
    {
      title: 'END BEFORE',
      fields: [time('endBefore', 'ex. 4:00 pm', filter.endBefore)],
    },
    {
      title: 'MEETING DAYS',
      fullRow: true,
      fields: [sel('meetingDays', Days, filter.meetingDays)],
    },
    {
      title: 'DISTRIBUTION AREAS',
      fullRow: true,
      fields: [sel('distros', Distros, filter.distros)],
    },
    {
      title: 'COMPONENTS',
      fullRow: true,
      fields: [sel('components', Components, filter.components)],
    },
    {
      title: 'INSTRUCTOR',
      fullRow: true,
      fields: [text('instructor', 'ex. John Doe', filter.instructor)],
    },
    {
      title: 'LOCATION',
      fullRow: true,
      fields: [
        text('location', 'ex. Technological Institute', filter.location),
      ],
    },
  ];
}

export function planSearchFilterForm(
  filter: FilterOptions
): AlertFormSection[] {
  const text = (
    name: string,
    placeholder: string,
    current?: string,
    validator?: TextValidator
  ): AlertFormFieldText => ({
    name,
    type: 'text',
    placeholder,
    defaultValue: current,
    validator,
  });
  const sel = (
    name: string,
    options: string[],
    current?: string[]
  ): AlertFormFieldMultiSelect => ({
    name,
    type: 'multi-select',
    options,
    defaultValue: current?.join(','),
  });

  return [
    {
      title: 'SUBJECT',
      fullRow: true,
      fields: [
        text('subject', 'ex. COMP_SCI', filter.subject, (value) =>
          PlanManager.isValidSubject(value.toUpperCase())
        ),
      ],
    },
    {
      title: 'DISTRIBUTION AREAS',
      fullRow: true,
      fields: [sel('distros', Distros, filter.distros)],
    },
    {
      title: 'UNITS AT LEAST',
      fields: [
        text('unitGeq', '', filter.unitGeq?.toString(), (v) => {
          const value = parseFloat(v);
          return !isNaN(value) && value >= 0 && value <= 99;
        }),
      ],
    },
    {
      title: 'UNITS AT MOST',
      fields: [
        text('unitLeq', '', filter.unitLeq?.toString(), (v) => {
          const value = parseFloat(v);
          return !isNaN(value) && value >= 0 && value <= 99;
        }),
      ],
    },
    {
      title: 'INCLUDE',
      fullRow: true,
      fields: [sel('include', ['Legacy Courses'], filter.include)],
    },
  ];
}

export function customSectionForm(): AlertFormSection[] {
  const text = (name: string): AlertFormFieldText => ({
    name,
    type: 'text',
    maxLength: 100,
  });
  const time = (name: string): AlertFormFieldTime => ({
    name,
    type: 'time',
    placeholder: 'hh:mm am/pm',
    required: true,
  });
  const sel: AlertFormFieldMultiSelect = {
    name: 'meeting_days',
    type: 'multi-select',
    options: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
    required: true,
  };

  return [
    {
      title: 'SUBJECT AND NUMBER',
      fullRow: true,
      fields: [text('subject')],
    },
    {
      title: 'TITLE',
      fullRow: true,
      fields: [text('title')],
    },
    {
      title: 'INSTRUCTOR',
      fullRow: true,
      fields: [text('instructor')],
    },
    {
      title: 'LOCATION',
      fullRow: true,
      fields: [text('location')],
    },
    {
      title: 'START',
      fields: [time('start')],
    },
    {
      title: 'END',
      fields: [time('end')],
    },
    {
      title: 'MEETING DAYS',
      fullRow: true,
      fields: [sel],
    },
  ];
}
