import {
  BookmarkIcon,
  CalendarIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { Alert } from '../../types/AlertTypes';
import {
  Color,
  ColorMap,
  IconElement,
  UserOptions,
} from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';
import Tooltip from '../generic/Tooltip';
import helpMenu from './Help';
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
  Bookmarks: 'indigo',
  Plans: 'rose',
};

interface TaskBarProps {
  openAboutMenu: () => void;
  alert: Alert;
  version: string;
  switches: UserOptions;
}

function Taskbar(props: TaskBarProps) {
  const switches = props.switches;
  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  return (
    <div className="mx-auto mt-2 mb-4 w-full gap-2">
      {/* <AboutMiniButton openAboutMenu={props.openAboutMenu} /> */}
      <Tabs
        switches={props.switches}
        switchName="tab"
        colorMap={TabBarButtonColors}
      >
        <TabButton
          name="Search"
          alwaysShowDisplay
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Search']}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </TabButton>
        <TabButton
          name="Bookmarks"
          alwaysShowDisplay
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Bookmarks']}
        >
          <BookmarkIcon className="h-4 w-4" />
        </TabButton>
        <TabButton
          name="Plans"
          alwaysShowDisplay
          display={isSchedule ? 'Schedules' : 'Plans'}
          selected={props.switches.get.tab as string}
          switches={props.switches}
          switchName="tab"
          color={TabBarButtonColors['Plans']}
        >
          {isSchedule ? (
            <CalendarIcon className="h-4 w-4" />
          ) : (
            <RectangleStackIcon className="h-4 w-4" />
          )}
        </TabButton>
      </Tabs>
    </div>
  );
}

export default Taskbar;
