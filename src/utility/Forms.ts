import PlanManager from '../PlanManager';
import {
  AlertFormFieldColorSelect,
  AlertFormFieldMultiSelect,
  AlertFormFieldSingleSelect,
  AlertFormFieldText,
  AlertFormFieldTime,
  AlertFormResponse,
  AlertFormSection,
} from '../types/AlertTypes';
import { Color, TextValidator } from '../types/BaseTypes';
import { Time } from '../types/ScheduleTypes';
import { FilterOptions } from '../types/SearchTypes';
import {
  Components,
  Days,
  Disciplines,
  Distros,
  GRADE_LEVELS,
  OVERALL_LEVELS,
  TIME_COMMITMENT_LEVELS,
} from './Constants';
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
      totalRowItems: 1,
      fields: [
        text('subject', 'ex. COMP_SCI', filter.subject, (value) =>
          PlanManager.isSchoolSubject(value.toUpperCase())
        ),
      ],
    },
    {
      title: 'MEETING DAYS',
      totalRowItems: 1,
      fields: [sel('meetingDays', Days, filter.meetingDays)],
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
      totalRowItems: 1,
      fields: [
        sel(
          'allAvailability',
          ['Filter by all available times on schedule'],
          filter.allAvailability
        ),
      ],
    },
    {
      title: 'FOUNDATIONAL DISCIPLINES',
      totalRowItems: 1,
      fields: [sel('disciplines', Disciplines, filter.disciplines)],
    },
    {
      title: 'DISTRIBUTION AREAS',
      totalRowItems: 1,
      fields: [sel('distros', Distros, filter.distros)],
    },
    {
      title: 'COMPONENTS',
      totalRowItems: 1,
      fields: [sel('components', Components, filter.components)],
    },
    {
      title: 'INSTRUCTOR',
      totalRowItems: 1,
      fields: [text('instructor', 'ex. John Doe', filter.instructor)],
    },
    {
      title: 'LOCATION',
      totalRowItems: 1,
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
      totalRowItems: 1,
      fields: [
        text('subject', 'ex. COMP_SCI', filter.subject, (value) =>
          PlanManager.isValidSubject(value.toUpperCase())
        ),
      ],
    },
    {
      title: 'FOUNDATIONAL DISCIPLINES',
      totalRowItems: 1,
      fields: [sel('disciplines', Disciplines, filter.disciplines)],
    },
    {
      title: 'DISTRIBUTION AREAS',
      totalRowItems: 1,
      fields: [sel('distros', Distros, filter.distros)],
    },
    {
      title: 'UNITS AT LEAST',
      totalRowItems: 2,
      fields: [
        text('unitGeq', '', filter.unitGeq?.toString(), (v) => {
          const value = parseFloat(v);
          return !isNaN(value) && value >= 0 && value <= 99;
        }),
      ],
    },
    {
      title: 'UNITS AT MOST',
      totalRowItems: 2,
      fields: [
        text('unitLeq', '', filter.unitLeq?.toString(), (v) => {
          const value = parseFloat(v);
          return !isNaN(value) && value >= 0 && value <= 99;
        }),
      ],
    },
    {
      title: 'INCLUDE',
      totalRowItems: 1,
      fields: [sel('include', ['Legacy Courses'], filter.include)],
    },
  ];
}

export function customCourseForm(
  defaults: AlertFormResponse = {}
): AlertFormSection[] {
  const text = (name: string, required = false): AlertFormFieldText => ({
    name,
    type: 'text',
    maxLength: 100,
    required,
    defaultValue: defaults[name],
  });
  const units: AlertFormFieldText = {
    name: 'units',
    type: 'text',
    maxLength: 10,
    required: false,
    defaultValue: defaults['units'],
    validator: (value) => {
      const val = parseFloat(value);
      return !isNaN(val) && val >= 0 && val <= 99;
    },
  };
  const col: AlertFormFieldColorSelect = {
    name: 'color',
    type: 'color-select',
    defaultValue: (defaults['color'] as Color) || 'gray',
  };

  return [
    {
      title: 'TITLE',
      totalRowItems: 1,
      fields: [text('title', true)],
    },
    {
      title: 'SUBTITLE',
      totalRowItems: 1,
      fields: [text('subtitle')],
    },
    {
      title: 'UNITS',
      totalRowItems: 1,
      fields: [units],
    },
    {
      title: 'COLOR',
      totalRowItems: 1,
      fields: [col],
    },
  ];
}

export function customSectionForm(
  defaults: AlertFormResponse = {}
): AlertFormSection[] {
  const text = (name: string, required = false): AlertFormFieldText => ({
    name,
    type: 'text',
    maxLength: 100,
    required,
    defaultValue: defaults[name],
  });
  const time = (name: string): AlertFormFieldTime => ({
    name,
    type: 'time',
    required: true,
    defaultValue: defaults[name],
  });
  const sel: AlertFormFieldMultiSelect = {
    name: 'meeting_days',
    type: 'multi-select',
    options: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
    required: true,
    defaultValue: defaults['meeting_days'],
  };
  const col: AlertFormFieldColorSelect = {
    name: 'color',
    type: 'color-select',
    defaultValue: (defaults['color'] as Color) || 'gray',
  };

  return [
    {
      title: 'TITLE',
      totalRowItems: 1,
      fields: [text('title', true)],
    },
    {
      title: 'SUBTITLE',
      totalRowItems: 1,
      fields: [text('subtitle')],
    },
    {
      title: 'INSTRUCTOR',
      totalRowItems: 1,
      fields: [text('instructor')],
    },
    {
      title: 'LOCATION',
      totalRowItems: 1,
      fields: [text('location')],
    },
    {
      title: 'MEETING DAYS',
      totalRowItems: 1,
      fields: [sel],
    },
    {
      title: 'START',
      totalRowItems: 2,
      fields: [time('start')],
    },
    {
      title: 'END',
      totalRowItems: 2,
      fields: [time('end')],
    },
    {
      title: 'COLOR',
      totalRowItems: 1,
      fields: [col],
    },
  ];
}

export function ratingsForm(): AlertFormSection[] {
  const overall: AlertFormFieldSingleSelect = {
    name: 'overall',
    type: 'single-select',
    options: OVERALL_LEVELS,
    required: false,
  };
  const timeCommitment: AlertFormFieldSingleSelect = {
    name: 'commitment',
    type: 'single-select',
    options: TIME_COMMITMENT_LEVELS,
    required: false,
  };
  const grade: AlertFormFieldSingleSelect = {
    name: 'grade',
    type: 'single-select',
    options: GRADE_LEVELS,
    required: false,
  };

  return [
    {
      title: 'OVERALL',
      description:
        'How would you rate the course overall, with 1 being the lowest and 5 being the highest?',
      totalRowItems: 1,
      fields: [overall],
    },
    {
      title: 'TIME COMMITMENT',
      description:
        'Approximately how long, in hours, did you spend per week outside of class for this course?',
      totalRowItems: 1,
      fields: [timeCommitment],
    },
    {
      title: 'GRADE',
      description: 'What grade did you receive in this course?',
      totalRowItems: 1,
      fields: [grade],
    },
  ];
}

export function feedbackForm(): AlertFormSection[] {
  const type: AlertFormFieldSingleSelect = {
    name: 'type',
    type: 'single-select',
    options: ['Bug', 'Feature Request', 'Course Data Error', 'Other'],
    required: true,
    defaultValue: 'Bug',
  };
  const title: AlertFormFieldText = {
    name: 'title',
    type: 'text',
    maxLength: 70,
    required: true,
  };
  const content: AlertFormFieldText = {
    name: 'content',
    type: 'text',
    maxLength: 1000,
    paragraph: true,
    required: true,
  };

  const readFaq: AlertFormFieldMultiSelect = {
    name: 'read_faq',
    type: 'multi-select',
    options: ['I have read the Paper FAQ'],
    required: true,
  };

  return [
    {
      title: 'TYPE',
      totalRowItems: 1,
      fields: [type],
    },
    {
      title: 'TITLE',
      description: 'A brief summary of the feedback topic.',
      totalRowItems: 1,
      fields: [title],
    },
    {
      title: 'MESSAGE',
      description:
        'If applicable, share details like the steps to reproduce the bug.',
      totalRowItems: 1,
      fields: [content],
    },
    {
      title: 'BEFORE SUBMITTING...',
      description:
        'To prevent duplicate or unnecessary feedback, make sure you read the FAQ linked above.',
      totalRowItems: 1,
      fields: [readFaq],
    },
  ];
}
