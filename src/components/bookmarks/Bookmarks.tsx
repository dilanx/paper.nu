import { SpinnerCircularFixed } from 'spinners-react';
import { Alert } from '../../types/AlertTypes';
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
import AccountPlanMessage from '../account/AccountPlanMessage';
import BookmarksList from './BookmarksList';
import ScheduleBookmarksList from './ScheduleBookmarksList';

interface BookmarksProps {
  bookmarks: BookmarksData;
  schedule: ScheduleData;
  sideCard: SideCard;
  alert: Alert;
  f: PlanModificationFunctions;
  sf: ScheduleModificationFunctions;
  scheduleInteractions: ScheduleInteractions;
  switches: UserOptions;
  loading: boolean;
}

function Bookmarks(props: BookmarksProps) {
  const mode = props.switches.get.mode;
  const darkMode = props.switches.get.dark;
  return (
    <div
      className="no-scrollbar my-2 h-full overflow-y-scroll rounded-2xl border-4
            border-indigo-300 shadow-lg"
    >
      <p className="my-4 text-center text-2xl font-bold text-indigo-300">
        BOOKMARKS
      </p>
      {props.loading ? (
        <AccountPlanMessage
          icon={
            <SpinnerCircularFixed
              size={64}
              thickness={160}
              speed={200}
              color={darkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)'}
              secondaryColor={
                darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'
              }
            />
          }
        />
      ) : mode === Mode.PLAN ? (
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
      ) : (
        <ScheduleBookmarksList
          schedule={props.schedule}
          sf={props.sf}
          interactions={props.scheduleInteractions}
          sideCard={props.sideCard}
          alert={props.alert}
        />
      )}
    </div>
  );
}

export default Bookmarks;
