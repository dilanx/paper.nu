import {
  BookmarkIcon,
  CalendarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { Alert } from '../../types/AlertTypes';
import {
  Color,
  ColorMap,
  IconElement,
  UserOptions,
} from '../../types/BaseTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import { Mode } from '../../utility/Constants';
import Tooltip from '../generic/Tooltip';
import feedbackMenu from './Feedback';
import settingsMenu from './Settings';
import { TabButton, Tabs } from './Tabs';

interface MiniButtonProps {
  icon: IconElement;
  color: Color;
  display: string;
  action: () => void;
}

function AboutMiniButton({ openAboutMenu }: { openAboutMenu: () => void }) {
  return (
    <button
      className="group relative rounded-lg border-2 border-gray-400 p-1 text-gray-500
    hover:border-black hover:text-black dark:border-gray-500 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
      onClick={() => openAboutMenu()}
    >
      <InformationCircleIcon className="h-5 w-5" />
      <div
        className="absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap
            rounded-md border-2 border-black bg-white p-1 text-sm font-medium text-black
            group-hover:block dark:border-white dark:bg-gray-800 dark:text-white"
      >
        About
      </div>
    </button>
  );
}

function MiniButton(props: MiniButtonProps) {
  let color = props.color;
  return (
    <button
      className={`rounded-lg border-2 border-gray-400 p-1 text-gray-500 dark:border-gray-500 dark:text-gray-300
                hover:border-${color}-500 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-gray-800
                hover:text-${color}-500 dark:hover:text-${color}-400 group relative`}
      onClick={() => {
        props.action();
      }}
    >
      <props.icon className="h-5 w-5" />
      <Tooltip color={color} className="-top-10 left-1/2 -translate-x-1/2">
        {props.display}
      </Tooltip>
    </button>
  );
}

const TabBarButtonColors: ColorMap = {
  Search: 'gray',
  'My List': 'indigo',
  Plans: 'rose',
};

interface TaskBarProps {
  openAboutMenu: () => void;
  alert: Alert;
  version: string;
  switches: UserOptions;
  f2: PlanSpecialFunctions;
}

function Taskbar(props: TaskBarProps) {
  const switches = props.switches;
  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  return (
    <div className="mx-auto mt-2 mb-4 flex gap-2">
      <AboutMiniButton openAboutMenu={props.openAboutMenu} />
      <MiniButton
        icon={PencilSquareIcon}
        color="violet"
        display="Feedback"
        action={() => props.alert(feedbackMenu())}
      />
      <MiniButton
        icon={Cog6ToothIcon}
        color="orange"
        display="Settings"
        action={() => props.alert(settingsMenu(props.f2))}
      />
      <Tabs
        switches={props.switches}
        switchName="tab"
        colorMap={TabBarButtonColors}
      >
        <TabButton
          name="Search"
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Search']}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </TabButton>
        <TabButton
          name="My List"
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['My List']}
        >
          <BookmarkIcon className="h-5 w-5" />
        </TabButton>
        <TabButton
          name="Plans"
          display={isSchedule ? 'Schedules' : 'Plans'}
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Plans']}
        >
          {isSchedule ? (
            <CalendarIcon className="h-5 w-5" />
          ) : (
            <RectangleStackIcon className="h-5 w-5" />
          )}
        </TabButton>
      </Tabs>
    </div>
  );
}

export default Taskbar;
