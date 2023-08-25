import {
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  InformationCircleIcon,
  MapIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SpinnerCircularFixed } from 'spinners-react';
import Account from '../../../Account';
import { discardNotesChanges } from '../../../app/AccountModification';
import { Alert } from '../../../types/AlertTypes';
import {
  ContextMenu,
  ContextMenuData,
  SaveState,
  UserOptions,
} from '../../../types/BaseTypes';
import { PlanData } from '../../../types/PlanTypes';
import { ScheduleData } from '../../../types/ScheduleTypes';
import { exportScheduleAsICS } from '../../../utility/Calendar';
import { Mode } from '../../../utility/Constants';
import { feedbackForm } from '../../../utility/Forms';
import { exportScheduleAsImage } from '../../../utility/Image';
import Links from '../../../utility/StaticLinks';
import Schedule from '../../schedule/Schedule';
import exportMenu from './Export';
import settingsMenu from './Settings';
import ToolbarAccount from './ToolbarAccount';
import ToolbarButton from './ToolbarButton';

interface ToolbarProps {
  alert: Alert;
  contextMenuData?: ContextMenuData;
  contextMenu: ContextMenu;
  plan: PlanData;
  schedule: ScheduleData;
  openMap?: () => void;
  switches: UserOptions;
  loading: boolean;
  openAboutMenu: () => void;
  saveState: SaveState;
}

function Toolbar({
  alert,
  contextMenuData,
  contextMenu,
  plan,
  schedule,
  openMap,
  switches,
  loading,
  openAboutMenu,
  saveState,
}: ToolbarProps) {
  const [takeImage, setTakeImage] = useState(false);

  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  const darkMode = switches.get.dark;

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
    <div
      className={`sticky top-0 z-30 flex w-full flex-col items-center justify-center gap-1 bg-white px-4 pt-4 pb-1 dark:bg-gray-800 md:flex-row lg:justify-end ${
        !isSchedule ? 'border-b-2 border-gray-200 dark:border-gray-700' : ''
      }`}
    >
      {activeItem && activeItem !== 'None' && (
        <div className="flex flex-1 items-center gap-2 overflow-hidden font-semibold text-gray-400">
          {isSchedule ? (
            <CalendarIcon className="h-5 w-5" />
          ) : (
            <RectangleStackIcon className="h-5 w-5" />
          )}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {activeItem}
          </p>
          <div className="flex items-center gap-1 text-xs font-normal text-gray-400">
            {saveState === 'idle' && (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                <p>saved!</p>
              </>
            )}
            {(saveState === 'start' ||
              saveState === 'wait' ||
              saveState === 'save') && (
              <>
                <SpinnerCircularFixed
                  size={14}
                  thickness={160}
                  speed={200}
                  color="#a1a1aa"
                  secondaryColor={darkMode ? '#404040' : '#f5f5f5'}
                />
                <p>saving...</p>
              </>
            )}
            {saveState === 'error' && (
              <>
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <p className="text-red-500">error when saving.</p>
              </>
            )}
          </div>
        </div>
      )}
      <div className="flex gap-1">
        <ToolbarButton
          icon={InformationCircleIcon}
          active={contextMenuData?.name === 'about'}
          onClick={(x, y) => {
            contextMenu({
              name: 'about',
              x,
              y,
              items: [
                {
                  text: 'About',
                  icon: InformationCircleIcon,
                  onClick: () => openAboutMenu(),
                },
                {
                  text: 'Help',
                  icon: QuestionMarkCircleIcon,
                  onClick: () => {
                    window.open(Links.SUPPORT, '_blank');
                  },
                },
                {
                  text: 'Feedback',
                  icon: InboxArrowDownIcon,
                  onClick: () => {
                    const loggedIn = Account.isLoggedIn();
                    alert({
                      title: 'Leave feedback on Paper',
                      message:
                        "I'm always looking to improve Paper through bug fixes and new features! Share your thoughts below.",
                      textHTML: (
                        <div className="mt-3">
                          <ul className="list-disc pl-4">
                            <li>
                              You <span className="font-bold">MUST</span> read
                              the{' '}
                              <a
                                href={Links.FAQ}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Frequently Asked Questions
                              </a>{' '}
                              before submitting any issues!
                            </li>
                            <li>
                              Submitting this form creates a public issue{' '}
                              <a
                                href={Links.ISSUES}
                                target="_blank"
                                rel="noreferrer"
                              >
                                here on GitHub
                              </a>
                              . If you have a GitHub account, you can{' '}
                              <a
                                href="https://github.com/dilanx/paper.nu/issues/new"
                                target="_blank"
                                rel="noreferrer"
                              >
                                create an issue
                              </a>{' '}
                              there directly to be notified of updates.
                            </li>
                            <li>
                              Your account information will not be shared
                              publicly in the posted issue but will be visible
                              to me privately.
                            </li>
                            <li>
                              You'll receive a confirmation email with the link
                              to your issue. Feel free to check back there for
                              updates!
                            </li>
                          </ul>

                          {!loggedIn && (
                            <p className="mt-3 text-base font-bold text-red-500 dark:text-red-400">
                              You must be logged in to Paper to submit feedback.
                            </p>
                          )}
                        </div>
                      ),
                      color: 'purple',
                      icon: InboxArrowDownIcon,
                      form: loggedIn
                        ? {
                            sections: feedbackForm(),
                            onSubmit: (data) => {
                              toast.promise(Account.feedback(data), {
                                loading: 'Submitting feedback...',
                                success: 'Feedback submitted!',
                                error: (err) => {
                                  console.error(err);
                                  return 'Failed to submit feedback.';
                                },
                              });
                            },
                          }
                        : undefined,
                      confirmButton: loggedIn ? 'Submit' : 'Log in',
                      action: () => {
                        if (!loggedIn) {
                          Account.logIn();
                        }
                      },
                      cancelButton: 'Cancel',
                    });
                  },
                },
              ],
            });
          }}
        >
          About
        </ToolbarButton>
        {isSchedule && (
          <ToolbarButton
            icon={MapIcon}
            onClick={() => {
              if (openMap) {
                openMap();
              }
            }}
          >
            Map
          </ToolbarButton>
        )}
        <ToolbarButton
          selected={switches.get.notes}
          icon={PencilSquareIcon}
          onClick={() => {
            if (switches.get.notes) {
              discardNotesChanges(switches, alert, () => {
                switches.set('notes', false);
                switches.set('unsaved_notes', false);
              });
            } else {
              switches.set('notes', true);
            }
          }}
        >
          Notes
        </ToolbarButton>
        <ToolbarButton
          icon={ArrowTopRightOnSquareIcon}
          active={contextMenuData?.name === 'export'}
          onClick={(x, y) => {
            contextMenu(
              exportMenu({
                x,
                y,
                plan: isSchedule ? undefined : plan,
                schedule: isSchedule ? schedule : undefined,
                alert,
                actions: {
                  link(text) {
                    if (!text) {
                      toast.error('Unable to copy URL');
                      return;
                    }
                    navigator.clipboard.writeText(text);
                    toast.success('URL copied to clipboard');
                  },
                  image() {
                    setTakeImage(true);
                  },
                  calendar(validSections) {
                    toast.promise(exportScheduleAsICS(validSections), {
                      loading: 'Exporting schedule...',
                      success: 'Exported schedule',
                      error: (res) => {
                        console.error(res);
                        return 'Failed to export schedule';
                      },
                    });
                  },
                },
              })
            );
          }}
        >
          Export
        </ToolbarButton>
        <ToolbarButton
          icon={Cog6ToothIcon}
          onClick={() => alert(settingsMenu())}
        >
          Settings
        </ToolbarButton>
      </div>
      <ToolbarAccount
        loading={loading}
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
                  window.open(Links.ACCOUNT, '_blank');
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
