import { motion } from 'framer-motion';
import { useState } from 'react';
import ScheduleManager from '../../ScheduleManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import { SideCard } from '../../types/SideCardTypes';
import SearchScheduleClass from '../search/SearchScheduleClass';

interface ScheduleBookmarksListProps {
  schedule: ScheduleData;
  switches: UserOptions;
  sf: ScheduleModificationFunctions;
  interactions: ScheduleInteractions;
  sideCard: SideCard;
  alert: Alert;
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
  let content = props.schedule.bookmarks;

  const [selected, setSelected] = useState<string | undefined>();

  let classes: JSX.Element[] | JSX.Element = [];
  if (content.length > 0) {
    classes = content.map((course, index) => {
      return (
        <SearchScheduleClass
          course={course}
          schedule={props.schedule}
          color={ScheduleManager.getCourseColor(course.subject)}
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
          switches={props.switches}
          key={`bookmark-${course.course_id}`}
        />
      );
    });
  } else {
    classes = (
      <div className={`overflow-hidden whitespace-normal text-center`}>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Find a class you're interested in but don't have a spot for it on your
          schedule yet? Bookmark it for later using the bookmark button found on
          each course in search results!
        </p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <div className="compact-mode relative m-4 space-y-3 rounded-lg border-2 border-indigo-500 px-1 pt-4 pb-8 shadow-lg">
        <p className="text-md m-0 p-0 text-center font-bold text-gray-600 dark:text-gray-400">
          BOOKMARKED COURSES
        </p>
        <div className="space-y-2">{classes}</div>
      </div>
    </motion.div>
  );
}

export default ScheduleBookmarksList;
