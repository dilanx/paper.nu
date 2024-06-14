import { motion } from 'framer-motion';
import { useState } from 'react';
import { Alert } from '@/types/AlertTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from '@/types/ScheduleTypes';
import { SideCard } from '@/types/SideCardTypes';
import SearchScheduleClass from '@/components/search/SearchScheduleClass';
import { OpenRatingsFn } from '@/types/RatingTypes';
import { getCourseColor } from '@/app/Plan';

interface ScheduleBookmarksListProps {
  schedule: ScheduleData;
  sf: ScheduleModificationFunctions;
  interactions: ScheduleInteractions;
  sideCard: SideCard;
  alert: Alert;
  openRatings: OpenRatingsFn;
}

const variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

function ScheduleBookmarksList(props: ScheduleBookmarksListProps) {
  const content = props.schedule.bookmarks;

  const [selected, setSelected] = useState<string | undefined>();

  let classes: JSX.Element[] | JSX.Element = [];
  if (content.length > 0) {
    classes = content.map((course) => {
      return (
        <SearchScheduleClass
          course={course}
          schedule={props.schedule}
          color={getCourseColor(course.subject)}
          selected={selected === course.course_id}
          select={() =>
            setSelected(
              selected === course.course_id ? undefined : course.course_id
            )
          }
          sf={props.sf}
          interactions={props.interactions}
          fromBookmarks={true}
          sideCard={props.sideCard}
          alert={props.alert}
          openRatings={props.openRatings}
          key={`bookmark-${course.course_id}`}
        />
      );
    });
  } else {
    classes = (
      <div className={`overflow-hidden whitespace-normal text-center`}>
        <p className="px-2 text-sm font-light text-gray-500 dark:text-gray-400">
          Find a class you're interested in but don't have a spot for it on your
          schedule yet? Bookmark it for later using the bookmark button found on
          each course in search results.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <div className="compact-mode relative m-4 space-y-3 rounded-lg border-2 border-indigo-500 px-1 pb-8 pt-4 shadow-lg">
        <p className="text-md m-0 p-0 text-center font-bold text-gray-600 dark:text-gray-400">
          BOOKMARKED COURSES
        </p>
        <div className="space-y-2">{classes}</div>
      </div>
    </motion.div>
  );
}

export default ScheduleBookmarksList;
