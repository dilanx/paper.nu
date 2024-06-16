import { useData } from '@/app/Context';
import { getCourseColor } from '@/app/Plan';
import SearchScheduleClass from '@/components/search/SearchScheduleClass';
import { ScheduleInteractions } from '@/types/ScheduleTypes';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ScheduleBookmarksListProps {
  interactions: ScheduleInteractions;
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

function ScheduleBookmarksList({ interactions }: ScheduleBookmarksListProps) {
  const {
    schedule: { bookmarks },
  } = useData();

  const [selected, setSelected] = useState<string | undefined>();

  let classes: JSX.Element[] | JSX.Element = [];
  if (bookmarks.length > 0) {
    classes = bookmarks.map((course) => {
      return (
        <SearchScheduleClass
          course={course}
          color={getCourseColor(course.subject)}
          selected={selected === course.course_id}
          select={() =>
            setSelected(
              selected === course.course_id ? undefined : course.course_id
            )
          }
          interactions={interactions}
          fromBookmarks={true}
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
