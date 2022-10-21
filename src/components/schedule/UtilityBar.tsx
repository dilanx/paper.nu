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
      className="absolute z-20 left-2 lg:left-0 top-1/2 -translate-y-1/2 border-2 border-green-300 p-1 rounded-xl bg-green-100 dark:bg-gray-700
                gap-2 flex flex-col opacity-40 hover:opacity-100 hover:shadow-lg transition-all duration-150 text-gray-600 dark:text-gray-300"
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
            confirmButtonColor: 'pink',
            cancelButton: 'Close',
            iconColor: 'pink',
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
        color="orange"
        display="Export as image"
        action={() => {
          alert({
            title: 'Export schedule as image',
            icon: CameraIcon,
            message:
              'This will export your schedule as an image, which you can then share!',
            confirmButton: 'Download',
            confirmButtonColor: 'orange',
            iconColor: 'orange',
            cancelButton: 'Cancel',
            action: () => setTakeImage(true),
          });
        }}
      />
      <UtilityBarButton
        icon={CalendarIcon}
        color="cyan"
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
            confirmButtonColor: 'cyan',
            iconColor: 'cyan',
            cancelButton: 'Cancel',
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
      {/* <UtilityBarButton
        icon={PlusIcon}
        color="pink"
        display="Add custom section"
        action={() => {
          if (
            !switches.get.active_schedule_id ||
            switches.get.active_schedule_id === 'None'
          ) {
            alert({
              title: 'Add custom section',
              icon: PlusIcon,
              message:
                "Custom sections can only be added to schedules linked to an account. Make sure you're logged in and have a schedule activated!",
              confirmButton: 'Get started',
              confirmButtonColor: 'pink',
              iconColor: 'pink',
              cancelButton: 'Close',
              action: () => {
                switches.set('tab', 'Plans');
              },
            });
            return;
          }
          alert({
            title: 'Add custom section',
            icon: PlusIcon,
            message:
              'Enhance your schedule with custom sections! Each value can be whatever you want. These sections will not be saved to the URL and will only be linked to the active account schedule.',
            form: {
              sections: customSectionForm(),
              onSubmit: (response) => {
                console.log(response);
              },
            },
            confirmButton: 'Add',
            confirmButtonColor: 'pink',
            iconColor: 'pink',
            cancelButton: 'Cancel',
          });
        }}
      /> */}

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
