import { CalendarIcon, CameraIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Alert } from '../../types/AlertTypes';
import { Color, IconElement, UserOptions } from '../../types/BaseTypes';
import { ScheduleData } from '../../types/ScheduleTypes';
import { exportScheduleAsICS, getSections } from '../../utility/Calendar';
import { exportScheduleAsImage } from '../../utility/Image';
import Utility from '../../utility/Utility';
import Schedule from './Schedule';

interface UtilityButtonProps {
  icon: IconElement;
  color: Color;
  display: string;
  action: () => void;
}

function UtilityButton(props: UtilityButtonProps) {
  const color = props.color;
  return (
    <button
      className={`hover:text-${color}-500 transition-all duration-150 relative group`}
      onClick={() => props.action()}
    >
      <props.icon className="w-6 h-6" />
      <div
        className={`hidden group-hover:block absolute z-20 left-10 top-1/2 -translate-y-1/2 p-1 border-2 rounded-md whitespace-nowrap
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
      >
        {props.display}
      </div>
    </button>
  );
}

interface UtilityBarProps {
  schedule: ScheduleData;
  switches: UserOptions;
  alert: Alert;
}

function UtilityBar({ schedule, switches, alert }: UtilityBarProps) {
  const [takeImage, setTakeImage] = useState(false);

  useEffect(() => {
    if (takeImage) {
      exportScheduleAsImage(switches.get.dark as boolean).finally(() => {
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
      <UtilityButton
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
      <UtilityButton
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

      {takeImage && (
        <div className="relative">
          <Schedule
            schedule={schedule}
            alert={alert}
            switches={switches}
            sf={undefined as any}
            imageMode={true}
          />
        </div>
      )}
    </div>
  );
}

export default UtilityBar;
