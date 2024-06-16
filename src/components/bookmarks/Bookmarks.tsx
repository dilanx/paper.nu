import { useApp } from '@/app/Context';
import { ScheduleInteractions } from '@/types/ScheduleTypes';
import { Mode } from '@/utility/Constants';
import { SpinnerCircularFixed } from 'spinners-react';
import AccountPlanMessage from '../account/AccountPlanMessage';
import BookmarksList from './BookmarksList';
import ScheduleBookmarksList from './ScheduleBookmarksList';

interface BookmarksProps {
  scheduleInteractions: ScheduleInteractions;
  loading: boolean;
}

function Bookmarks(props: BookmarksProps) {
  const { userOptions } = useApp();
  const mode = userOptions.get.mode;
  const darkMode = userOptions.get.dark;

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
          <BookmarksList credit={false} />
          <BookmarksList credit={true} />
        </>
      ) : (
        <ScheduleBookmarksList interactions={props.scheduleInteractions} />
      )}
    </div>
  );
}

export default Bookmarks;
