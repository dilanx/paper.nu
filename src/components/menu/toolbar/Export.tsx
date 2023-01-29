import {
  CalendarIcon,
  CameraIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { Alert } from '../../../types/AlertTypes';
import { Color, ContextMenuData } from '../../../types/BaseTypes';
import {
  ScheduleData,
  ValidScheduleDataMap,
} from '../../../types/ScheduleTypes';
import { getSections } from '../../../utility/Calendar';
import Utility from '../../../utility/Utility';

type ActionFunction<T = null> = (data: T) => void;

interface ExportMenuData {
  x: number;
  y: number;
  theme: Color;
  schedule: ScheduleData;
  alert: Alert;
  actions: {
    link: ActionFunction;
    image: ActionFunction;
    calendar: ActionFunction<ValidScheduleDataMap>;
  };
}

const exportMenu = ({
  x,
  y,
  theme,
  schedule,
  alert,
  actions,
}: ExportMenuData): ContextMenuData => ({
  name: 'export',
  x,
  y,
  theme,
  items: [
    {
      text: 'Share link',
      icon: LinkIcon,
      onClick: () => {
        alert({
          title: 'Ready to share!',
          message:
            'All of your data is stored in the URL. When you make changes, the URL is updated to reflect them. Save it somewhere, or share with a friend!',
          confirmButton: 'Copy to clipboard',
          cancelButton: 'Close',
          color: 'sky',
          icon: LinkIcon,
          textView: window.location.href,
          action: () => actions.link(null),
        });
      },
    },
    {
      text: 'Export as image',
      icon: CameraIcon,
      onClick: () => {
        alert({
          title: 'Export schedule as image',
          icon: CameraIcon,
          message:
            'This will export your schedule as an image, which you can then share!',
          confirmButton: 'Download',
          color: 'sky',
          cancelButton: 'Cancel',
          action: () => actions.image(null),
        });
      },
    },
    {
      text: 'Export to calendar',
      icon: CalendarIcon,
      onClick: () => {
        const { validSections, invalidSections } = getSections(schedule);
        const noValidSections = Object.keys(validSections).length === 0;

        const invalidSectionMessage =
          Object.keys(invalidSections).length > 0
            ? `\n\nThe following sections cannot be added to the exported schedule because they don't have valid meeting time data: ${Utility.formatSections(
                invalidSections
              )}`
            : '';

        alert({
          title: 'Export schedule to calendar',
          icon: CalendarIcon,
          message: `This will export your schedule to an ICS file, which you can then import into your calendar app! Ensure that you set your time zone to central time (Chicago, United States).${invalidSectionMessage}`,
          textHTML: (
            <p className="my-2">
              Here are some instructions on how to import events into some
              popular calendar apps:{' '}
              <a href="https://support.apple.com/en-ca/guide/calendar/icl1023/mac">
                Apple Calendar
              </a>
              ,{' '}
              <a href="https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop">
                Google Calendar
              </a>
              ,{' '}
              <a href="https://support.microsoft.com/en-us/office/import-calendars-into-outlook-8e8364e1-400e-4c0f-a573-fe76b5a2d379">
                Microsoft Outlook
              </a>
            </p>
          ),
          confirmButton: 'Download',
          disableConfirmButton: noValidSections
            ? 'Nothing to export'
            : undefined,
          color: 'sky',
          cancelButton: 'Cancel',
          action: () => actions.calendar(validSections),
        });
      },
    },
  ],
});

export default exportMenu;
