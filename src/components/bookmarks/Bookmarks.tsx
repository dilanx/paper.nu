import { UserOptions } from '../../types/BaseTypes';
import {
  BookmarksData,
  PlanModificationFunctions,
} from '../../types/PlanTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import { SideCard } from '../../types/SideCardTypes';
import { Mode } from '../../utility/Constants';
import BookmarksList from './BookmarksList';
import ScheduleBookmarksList from './ScheduleBookmarksList';

interface BookmarksProps {
  bookmarks: BookmarksData;
  schedule: ScheduleData;
  sideCard: SideCard;
  f: PlanModificationFunctions;
  sf: ScheduleModificationFunctions;
  scheduleInteractions: ScheduleInteractions;
  switches: UserOptions;
}

function Bookmarks(props: BookmarksProps) {
  const mode = props.switches.get.mode;
  return (
    <div
      className="border-4 border-indigo-300 my-2 rounded-lg shadow-lg h-full
            overflow-y-scroll no-scrollbar"
    >
      <p className="text-center text-2xl text-indigo-300 font-bold my-4">
        MY LIST
      </p>
      {mode === Mode.PLAN && (
        <>
          <BookmarksList
            credit={false}
            bookmarks={props.bookmarks}
            sideCard={props.sideCard}
            f={props.f}
            switches={props.switches}
          />
          <BookmarksList
            credit={true}
            bookmarks={props.bookmarks}
            sideCard={props.sideCard}
            f={props.f}
            switches={props.switches}
          />
        </>
      )}
      {mode === Mode.SCHEDULE && (
        <ScheduleBookmarksList
          schedule={props.schedule}
          switches={props.switches}
          sf={props.sf}
          interactions={props.scheduleInteractions}
        />
      )}
    </div>
  );
}

export default Bookmarks;
