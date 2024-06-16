import { getPlan, getSchedule, login, logout } from '@/app/Account';
import { discardNotesChanges } from '@/app/AccountModification';
import { useApp, useData } from '@/app/Context';
import Tooltip from '@/components/generic/Tooltip';
import { SaveState } from '@/types/BaseTypes';
import { Mode } from '@/utility/Constants';
import Links from '@/utility/StaticLinks';
import {
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  InformationCircleIcon,
  MapIcon,
  NewspaperIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { SpinnerCircularFixed } from 'spinners-react';
import settingsMenu from './Settings';
import { shareMenu } from './Share';
import ToolbarAccount from './ToolbarAccount';
import ToolbarButton from './ToolbarButton';

function ToolbarDivider() {
  return <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-500" />;
}

interface ToolbarProps {
  loading: boolean;
  openAboutMenu: () => void;
  saveState: SaveState;
}

function Toolbar({ loading, openAboutMenu, saveState }: ToolbarProps) {
  const {
    version,
    userOptions,
    activeContextMenu,
    alert,
    contextMenu,
    mapView,
  } = useApp();
  const { plan, schedule } = useData();
  const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
  const darkMode = userOptions.get.dark;

  const activeItem = isSchedule
    ? userOptions.get.active_schedule_id
      ? getSchedule(userOptions.get.active_schedule_id)
      : undefined
    : userOptions.get.active_plan_id
    ? getPlan(userOptions.get.active_plan_id)
    : undefined;

  return (
    <div
      className={`sticky top-0 z-30 flex w-full flex-col items-center justify-center gap-1 bg-white px-4 pb-1 pt-4 dark:bg-gray-800 md:flex-row lg:justify-end ${
        !isSchedule ? 'border-b-2 border-gray-200 dark:border-gray-700' : ''
      }`}
    >
      {activeItem && (
        <div className="flex flex-1 items-center gap-2 font-semibold text-gray-400">
          <div className="group relative flex cursor-default items-center gap-2 rounded-sm p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700">
            {isSchedule ? (
              <CalendarIcon className="h-4 min-h-[1rem] w-4 min-w-[1rem]" />
            ) : (
              <RectangleStackIcon className="h-4 min-h-[1rem] w-4 min-w-[1rem]" />
            )}
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              {activeItem.name || '-'}
            </p>
            <Tooltip mini color="gray" className="-bottom-6 left-0 z-40">
              ID: {activeItem.id}
            </Tooltip>
          </div>
          {activeItem.public && (
            <>
              <ToolbarDivider />
              <div className="group relative flex cursor-default items-center justify-center rounded-sm p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700">
                <UserGroupIcon className="group relative h-4 w-4" />
                <Tooltip mini color="sky" className="-bottom-6 left-0 z-40">
                  Accessible by link
                </Tooltip>
              </div>
            </>
          )}
          <ToolbarDivider />
          <div className="group relative flex cursor-default items-center gap-1 rounded-sm p-0.5 text-xs font-normal text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
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
            <Tooltip mini color="green" className="-bottom-6 left-0 z-40">
              {saveState === 'idle' && 'All changes saved'}
              {(saveState === 'start' || saveState === 'wait') &&
                'Preparing to save...'}
              {saveState === 'save' && 'Saving...'}
              {saveState === 'error' &&
                'An error occurred when saving. Try again later.'}
            </Tooltip>
          </div>
        </div>
      )}
      <div className="flex gap-1">
        <ToolbarButton
          icon={InformationCircleIcon}
          active={activeContextMenu === 'about'}
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
                  text: "What's new",
                  icon: NewspaperIcon,
                  onClick: () => {
                    window.open(Links.CHANGELOG, '_blank');
                  },
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
                    window.open(
                      `${Links.FEEDBACK}?v=v${encodeURIComponent(version)}`,
                      '_blank'
                    );
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
              mapView();
            }}
          >
            Map
          </ToolbarButton>
        )}
        <ToolbarButton
          selected={userOptions.get.notes}
          icon={PencilSquareIcon}
          onClick={() => {
            if (userOptions.get.notes) {
              discardNotesChanges(userOptions, alert, () => {
                userOptions.set('notes', false);
                userOptions.set('unsaved_notes', false);
              });
            } else {
              userOptions.set('notes', true);
            }
          }}
        >
          Notes
        </ToolbarButton>
        <ToolbarButton
          active={activeContextMenu === 'share'}
          icon={UserGroupIcon}
          onClick={(x, y) => {
            contextMenu(
              shareMenu({ x, y, plan, schedule, alert, userOptions })
            );
          }}
        >
          Share
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
        active={activeContextMenu === 'account'}
        onClick={(x, y, signedIn) => {
          if (!signedIn) {
            login();
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
                  userOptions.set('tab', 'Plans');
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
                      logout();
                    },
                  });
                },
              },
            ],
          });
        }}
      />
    </div>
  );
}

export default Toolbar;
