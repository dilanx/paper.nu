import { useApp } from '@/app/Context';
import { ColorMap } from '@/types/BaseTypes';
import { Mode } from '@/utility/Constants';
import {
  BookmarkIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { TabButton, Tabs } from './Tabs';

const TabBarButtonColors: ColorMap = {
  Search: 'gray',
  Bookmarks: 'indigo',
  Plans: 'rose',
};

function Taskbar() {
  const { userOptions } = useApp();
  const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
  return (
    <div className="mx-auto mb-4 mt-2 w-full gap-2">
      <Tabs switchName="tab" colorMap={TabBarButtonColors}>
        <TabButton
          name="Search"
          alwaysShowDisplay
          selected={userOptions.get.tab as string}
          switchName="tab"
          color={TabBarButtonColors['Search']}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </TabButton>
        <TabButton
          name="Bookmarks"
          alwaysShowDisplay
          selected={userOptions.get.tab as string}
          switchName="tab"
          color={TabBarButtonColors['Bookmarks']}
        >
          <BookmarkIcon className="h-4 w-4" />
        </TabButton>
        <TabButton
          name="Plans"
          alwaysShowDisplay
          display={isSchedule ? 'Schedules' : 'Plans'}
          selected={userOptions.get.tab as string}
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
