import {
  CalendarIcon,
  CameraIcon,
  ArrowTopRightOnSquareIcon,
  MapIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { ScheduleData } from '../../types/ScheduleTypes';
import { exportScheduleAsICS, getSections } from '../../utility/Calendar';
import { exportScheduleAsImage } from '../../utility/Image';
import Utility from '../../utility/Utility';
import Schedule from './Schedule';
import UtilityBarButton from './UtilityBarButton';

interface UtilityBarProps {
  schedule: ScheduleData;
  switches: UserOptions;
  alert: Alert;
  openMap?: () => void;
}

function UtilityBar({ schedule, switches, alert, openMap }: UtilityBarProps) {
  const [takeImage, setTakeImage] = useState(false);

  useEffect(() => {
    if (takeImage) {
      exportScheduleAsImage(switches.get.dark).finally(() => {
        setTakeImage(false);
        toast.success('Exported schedule as image');
      });
    }
  }, [takeImage, switches]);

  return (
    <div
      className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 rounded-xl border-2 border-green-300 bg-green-100
                p-1 text-gray-600 opacity-75 transition-all duration-150 hover:opacity-100 hover:shadow-lg dark:bg-gray-700 dark:text-gray-300 lg:left-0"
    >
      <UtilityBarButton
        icon={ArrowTopRightOnSquareIcon}
        color="pink"
        display="Share"
        action={() => {
          alert({
            title: 'Ready to share!',
            message:
              'All of your data is stored in the URL. When you make changes, the URL is updated to reflect them. Save it somewhere, or share with a friend!',
            confirmButton: 'Copy to clipboard',
            cancelButton: 'Close',
            color: 'pink',
            icon: ArrowTopRightOnSquareIcon,
            textView: window.location.href,
            action: () => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('URL copied to clipboard');
            },
          });
        }}
      />
      <UtilityBarButton
        icon={CameraIcon}
        color="sky"
        display="Export as image"
        action={() => {
          alert({
            title: 'Export schedule as image',
            icon: CameraIcon,
            message:
              'This will export your schedule as an image, which you can then share!',
            confirmButton: 'Download',
            color: 'sky',
            cancelButton: 'Cancel',
            action: () => setTakeImage(true),
          });
        }}
      />
      <UtilityBarButton
        icon={CalendarIcon}
        color="red"
        display="Export to calendar"
        action={() => {
          const { validSections, invalidSections } = getSections(schedule);

          const invalidSectionMessage =
            Object.keys(invalidSections).length > 0
              ? `\n\nThe following sections cannot be added to the exported schedule because they don't have valid meeting time data: ${Utility.formatSections(
                  invalidSections
                )}`
              : '';

          alert({
            title: 'Export schedule to calendar',
            icon: CalendarIcon,
            message: `This will export your schedule to an ICS file, which you can then import into your calendar app! Ensure that you set your time zone to central time (Chicago, U.S.A.).${invalidSectionMessage}`,
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
            color: 'red',
            cancelButton: 'Cancel',
            notice:
              "I'm aware of an issue some people are experiencing with exporting their schedule to calendar. I've been able to recreate this issue with certain schedules, so I'll fix it soon!",
            action: () => exportScheduleAsICS(validSections),
          });
        }}
      />
      <UtilityBarButton
        icon={MapIcon}
        color="emerald"
        display="View campus map"
        action={() => {
          if (openMap) {
            openMap();
          }
        }}
      />

      {takeImage && (
        <div className="relative">
          <Schedule
            schedule={schedule}
            alert={alert}
            switches={switches}
            sf={undefined as any}
            ff={undefined as any}
            imageMode={true}
          />
        </div>
      )}
    </div>
  );
}

export default UtilityBar;
