import { Alert } from '@/types/AlertTypes';
import { ContextMenuData } from '@/types/BaseTypes';
import { ScheduleData, ValidScheduleDataMap } from '@/types/ScheduleTypes';
import { getSections } from '@/utility/Calendar';
import Links from '@/utility/StaticLinks';
import { formatSections } from '@/utility/Utility';
import { CalendarIcon, CameraIcon } from '@heroicons/react/24/outline';

type ActionFunction<T = null> = (data: T) => void;

interface ExportMenuData {
  x: number;
  y: number;
  schedule: ScheduleData;
  alert: Alert;
  actions: {
    image: ActionFunction;
    calendar: ActionFunction<ValidScheduleDataMap>;
  };
}

const exportMenu = ({
  x,
  y,
  schedule,
  alert,
  actions,
}: ExportMenuData): ContextMenuData => {
  const data: ContextMenuData = {
    name: 'export',
    x,
    y,
    items: [
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
              ? ` The following sections cannot be added to the exported schedule because they don't have valid meeting time data: ${formatSections(
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
                <a href={Links.EXPORT_APPLE}>Apple Calendar</a>,{' '}
                <a href={Links.EXPORT_GOOGLE}>Google Calendar</a>,{' '}
                <a href={Links.EXPORT_MICROSOFT}>Microsoft Outlook</a>
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
  };

  return data;
};

export default exportMenu;
