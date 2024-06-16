import { useApp, useData, useModification } from '@/app/Context';
import { getQuarterCredits } from '@/app/Plan';
import { CourseDragItem } from '@/types/PlanTypes';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import Class from '../plan/Class';

interface BookmarksListProps {
  credit: boolean;
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

function BookmarksList({ credit }: BookmarksListProps) {
  const { userOptions } = useApp();
  const {
    plan: { bookmarks },
  } = useData();
  const { planModification } = useModification();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'Class',
    drop: (item: CourseDragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      planModification.addBookmark(item.course, credit);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const content = credit
    ? Array.from(bookmarks.forCredit)
    : Array.from(bookmarks.noCredit);
  let classes: JSX.Element[] | JSX.Element = [];
  if (content.length > 0) {
    classes = content.map((classData, index) => {
      return (
        <Class
          course={classData}
          location={{ year: -1, quarter: credit ? 1 : 0 }}
          key={classData.id + '-' + index}
        />
      );
    });
  } else {
    classes = (
      <div className={`overflow-hidden whitespace-normal text-center`}>
        <p className="px-2 text-sm font-light text-gray-500 dark:text-gray-400">
          {credit
            ? `Classes here are counted towards total credit (like classes you've received AP/IB credit for).`
            : `Find a class you're interested in but don't have a spot for it on your schedule yet? Bookmark it for later by dragging it here.`}
        </p>
      </div>
    );
  }

  const units = getQuarterCredits(content);

  let unitString = 'units';
  if (units === 1) {
    unitString = 'unit';
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <div
        ref={drop}
        className={`compact-mode relative m-4 rounded-lg border-2 px-4 pb-8 pt-4
                    ${
                      isOver
                        ? 'border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50'
                        : `border-solid bg-gray-50 dark:bg-gray-800
                        ${
                          credit
                            ? 'border-indigo-800 dark:border-indigo-400'
                            : 'border-indigo-500'
                        }`
                    } space-y-3 shadow-lg`}
      >
        <p className="text-md m-0 p-0 text-center font-bold text-gray-600 dark:text-gray-400">
          {credit ? 'FOR CREDIT' : 'BOOKMARKED COURSES'}
        </p>
        <div className="space-y-2">{classes}</div>
        {credit && userOptions.get.quarter_units && (
          <p className="absolute right-2 top-0 m-0 p-0 text-right text-xs font-normal text-gray-400">
            <span className="font-medium">{units}</span> {unitString}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default BookmarksList;
