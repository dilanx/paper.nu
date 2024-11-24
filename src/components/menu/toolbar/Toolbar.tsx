import { getPlan, getSchedule, login, logout } from '@/app/Account';
import { discardNotesChanges } from '@/app/AccountModification';
import { useApp, useData } from '@/app/Context';
import { SaveState } from '@/types/BaseTypes';
import { Mode } from '@/utility/Constants';
import Links from '@/utility/StaticLinks';
import {
  ArrowRightOnRectangleIcon,
  CalendarIcon as CalendarIconOutline,
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  InboxArrowDownIcon,
  InformationCircleIcon,
  MapIcon,
  NewspaperIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon as RectangleStackIconOutline,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarIcon as CalendarIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
} from '@heroicons/react/24/solid';
import settingsMenu from './Settings';
import { shareMenu } from './Share';
import ToolbarAccount from './ToolbarAccount';
import ToolbarButton from './ToolbarButton';
import ToolbarStatus from './ToolbarStatus';

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
        <ToolbarStatus activeItem={activeItem} saveState={saveState} />
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
                  disabled: true,
                  disabledReason:
                    'Documentation website migration in progress.',
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
                {
                  text: 'Contribute',
                  icon: CodeBracketSquareIcon,
                  onClick: () => {
                    window.open(Links.CONTRIBUTE, '_blank');
                  },
                  disabled: true,
                  disabledReason:
                    'Documentation website migration in progress.',
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
          icon={PencilSquareIcon}
          selected={userOptions.get.notes}
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
          icon={UserGroupIcon}
          active={activeContextMenu === 'share'}
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
          active={activeContextMenu === 'settings'}
          onClick={(x, y) => {
            contextMenu({
              name: 'settings',
              x,
              y,
              items: [
                {
                  text: 'General',
                  icon: Cog6ToothIcon,
                  onClick: () => {
                    userOptions.set('settings_tab', 'General');
                    alert(settingsMenu());
                  },
                },
                {
                  text: 'Plan',
                  icon: RectangleStackIconOutline,
                  onClick: () => {
                    userOptions.set('settings_tab', 'Plan');
                    alert(settingsMenu());
                  },
                },
                {
                  text: 'Schedule',
                  icon: CalendarIconOutline,
                  onClick: () => {
                    userOptions.set('settings_tab', 'Schedule');
                    alert(settingsMenu());
                  },
                },
                {
                  text: 'Advanced',
                  icon: EllipsisHorizontalIcon,
                  onClick: () => {
                    userOptions.set('settings_tab', 'Advanced');
                    alert(settingsMenu());
                  },
                },
              ],
            });
          }}
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
                icon: isSchedule ? CalendarIconSolid : RectangleStackIconSolid,
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
