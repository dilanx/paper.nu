import {
  AlertFormFieldMultiSelect,
  AlertFormFieldText,
  AlertFormFieldTime,
  AlertFormSection,
} from '../types/AlertTypes';

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
  });
  const sel: AlertFormFieldMultiSelect = {
    name: 'meeting_days',
    type: 'multi-select',
    options: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
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
