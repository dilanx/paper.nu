import {
  BookmarkIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { Alert } from '../../types/AlertTypes';
import { ColorMap, UserOptions } from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';
import { TabButton, Tabs } from './Tabs';

const TabBarButtonColors: ColorMap = {
  Search: 'gray',
  Bookmarks: 'indigo',
  Plans: 'rose',
};

interface TaskBarProps {
  alert: Alert;
  version: string;
  switches: UserOptions;
}

function Taskbar(props: TaskBarProps) {
  const switches = props.switches;
  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  return (
    <div className="mx-auto mb-4 mt-2 w-full gap-2">
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
