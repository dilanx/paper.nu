import { CalendarIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Alert } from '../../../types/AlertTypes';
import { ContextMenuData } from '../../../types/BaseTypes';
import { PlanData } from '../../../types/PlanTypes';
import {
  ScheduleData,
  ValidScheduleDataMap,
} from '../../../types/ScheduleTypes';
import { getSections } from '../../../utility/Calendar';
import Links from '../../../utility/StaticLinks';
import Utility from '../../../utility/Utility';

type ActionFunction<T = null> = (data: T) => void;

interface ExportMenuData {
  x: number;
  y: number;
  plan?: PlanData;
  schedule?: ScheduleData;
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
      // {
      //   text: 'Share link',
      //   icon: LinkIcon,
      //   onClick: () => {
      //     const id = toast.loading('Generating link...');
      //     async function generateShortLink() {
      //       if (!sData) {
      //         throw new PaperError('No data to shorten');
      //       }
      //       const response = await fetch(`${Links.SERVER}/paper/shorten`, {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           // TODO update this!
      //           content: sData,
      //         }),
      //       });
      //       if (!response.ok) {
      //         throw new PaperError('Failed to generate shortened link');
      //       }
      //       const data = await response.json();
      //       return `${window.location.origin}/#${data.shortCode}`;
      //     }
      //     generateShortLink()
      //       .then((link) => {
      //         toast.success('Link generated!', { id });
      //         alert({
      //           title: 'Ready to share!',
      //           message: `Share your ${
      //             isPlan ? 'plan' : 'schedule'
      //           } with others using the link below. TODO dilan update this message don't forget pls!`,
      //           confirmButton: 'Copy to clipboard',
      //           cancelButton: 'Close',
      //           color: 'sky',
      //           icon: LinkIcon,
      //           textView: {
      //             text: link,
      //           },
      //           action: ({ textViewValue }) => actions.link(textViewValue),
      //         });
      //       })
      //       .catch((err) => {
      //         console.error(err);
      //         toast.error('Failed to generate link', { id });
      //       });
      //   },
      // },
    ],
  };

  if (schedule) {
    data.items.push(
      ...[
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
      ]
    );
  }

  return data;
};

export default exportMenu;
