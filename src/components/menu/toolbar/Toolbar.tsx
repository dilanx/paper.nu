import {
  ArrowDownOnSquareIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  CameraIcon,
  MapIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Account from '../../../Account';
import { Alert } from '../../../types/AlertTypes';
import {
  ContextMenu,
  ContextMenuData,
  UserOptions,
} from '../../../types/BaseTypes';
import { ScheduleData } from '../../../types/ScheduleTypes';
import { exportScheduleAsICS, getSections } from '../../../utility/Calendar';
import { Mode } from '../../../utility/Constants';
import { exportScheduleAsImage } from '../../../utility/Image';
import Utility from '../../../utility/Utility';
import Schedule from '../../schedule/Schedule';
import ToolbarAccount from './ToolbarAccount';
import ToolbarButton from './ToolbarButton';

interface ToolbarProps {
  alert: Alert;
  contextMenuData?: ContextMenuData;
  contextMenu: ContextMenu;
  schedule: ScheduleData;
  openMap?: () => void;
  switches: UserOptions;
  loading: boolean;
}

function Toolbar({
  alert,
  contextMenuData,
  contextMenu,
  schedule,
  openMap,
  switches,
  loading,
}: ToolbarProps) {
  const [takeImage, setTakeImage] = useState(false);

  const isSchedule = switches.get.mode === Mode.SCHEDULE;

  const theme = isSchedule ? 'green' : 'purple';

  const activeItem = isSchedule
    ? switches.get.active_schedule_id
      ? Account.getScheduleName(switches.get.active_schedule_id)
      : undefined
    : switches.get.active_plan_id
    ? Account.getPlanName(switches.get.active_plan_id)
    : undefined;

  useEffect(() => {
    if (takeImage) {
      exportScheduleAsImage(switches.get.dark).finally(() => {
        setTakeImage(false);
        toast.success('Exported schedule as image');
      });
    }
  }, [takeImage, switches]);

  return (
    <div className="sticky top-0 z-30 flex w-full items-center justify-center gap-1 bg-white px-4 pt-4 pb-2 dark:bg-gray-800 lg:justify-end">
      {activeItem && activeItem !== 'None' && (
        <div className="flex flex-1 items-center gap-2 font-semibold text-gray-400">
          {isSchedule ? (
            <CalendarIcon className="h-5 w-5" />
          ) : (
            <RectangleStackIcon className="h-5 w-5" />
          )}
          <p>{activeItem}</p>
        </div>
      )}
      {isSchedule && (
        <ToolbarButton
          theme={theme}
          icon={MapIcon}
          onClick={() => {
            if (openMap) {
              openMap();
            }
          }}
        >
          Campus map
        </ToolbarButton>
      )}
      {isSchedule && (
        <ToolbarButton
          theme={theme}
          icon={ArrowDownOnSquareIcon}
          active={contextMenuData?.name === 'export'}
          onClick={(x, y) => {
            contextMenu({
              name: 'export',
              x,
              y,
              theme,
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
                      action: () => setTakeImage(true),
                    });
                  },
                },
                {
                  text: 'Export to calendar',
                  icon: CalendarIcon,
                  onClick: () => {
                    const { validSections, invalidSections } =
                      getSections(schedule);
                    const noValidSections =
                      Object.keys(validSections).length === 0;

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
                          Here are some instructions on how to import events
                          into some popular calendar apps:{' '}
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
                      color: 'red',
                      cancelButton: 'Cancel',
                      action: () => {
                        toast.promise(exportScheduleAsICS(validSections), {
                          loading: 'Exporting schedule...',
                          success: 'Exported schedule',
                          error: (res) => {
                            console.error(res);
                            return 'Failed to export schedule';
                          },
                        });
                      },
                    });
                  },
                },
              ],
            });
          }}
        >
          Export
        </ToolbarButton>
      )}
      <ToolbarButton
        theme={theme}
        icon={ArrowTopRightOnSquareIcon}
        onClick={() => {
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
      >
        Share
      </ToolbarButton>
      <ToolbarAccount
        loading={loading}
        theme={theme}
        active={contextMenuData?.name === 'account'}
        onClick={(x, y, signedIn) => {
          if (!signedIn) {
            Account.logIn();
            return;
          }
          contextMenu({
            name: 'account',
            x,
            y,
            theme,
            items: [
              {
                text: isSchedule ? 'Schedules' : 'Plans',
                icon: isSchedule ? CalendarIcon : RectangleStackIcon,
                onClick: () => {
                  switches.set('tab', 'Plans');
                },
              },
              {
                text: 'Manage account',
                icon: UserCircleIcon,
                onClick: () => {
                  window.open('https://auth.dilanxd.com/account', '_blank');
                },
              },
              {
                text: 'Sign out',
                icon: ArrowRightOnRectangleIcon,
                onClick: () => {
                  alert({
                    title: 'Logging out...',
                    message: `Are you sure you want to log out? Make sure your changes are saved!`,
                    cancelButton: 'Cancel',
                    confirmButton: 'Log out',
                    color: 'rose',
                    icon: ArrowRightOnRectangleIcon,
                    action: () => {
                      Account.logOut();
                    },
                  });
                },
              },
            ],
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
            ff={undefined as any}
            imageMode={true}
          />
        </div>
      )}
    </div>
  );
}

export default Toolbar;
