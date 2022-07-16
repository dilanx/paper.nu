import { motion } from 'framer-motion';
import { useState } from 'react';
import ScheduleManager from '../../ScheduleManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
    ScheduleBookmarks,
    ScheduleData,
    ScheduleInteractions,
    ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';
import Class from '../plan/Class';
import SearchScheduleClass from '../search/SearchScheduleClass';

interface ScheduleBookmarksListProps {
    schedule: ScheduleData;
    alert: Alert;
    switches: UserOptions;
    sf: ScheduleModificationFunctions;
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

/*
<Class
                    course={classData}
                    bookmarks={props.bookmarks}
                    alert={props.alert}
                    location={{ year: -1, quarter: props.credit ? 1 : 0 }}
                    f={props.f}
                    switches={props.switches}
                    key={classData.id + '-' + index}
                />
*/

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
                            selected === course.course_id
                                ? undefined
                                : course.course_id
                        )
                    }
                    sf={props.sf}
                    interactions={props.interactions}
                    fromBookmarks={true}
                    key={`bookmark-${course.course_id}`}
                />
            );
        });
    } else {
        classes = (
            <div className={`text-center overflow-hidden whitespace-normal`}>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Find a class you're interested in but don't have a spot for
                    it on your schedule yet? Bookmark it for later by dragging
                    it here.
                </p>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={variants}>
            <div className="compact-mode relative m-4 rounded-lg px-4 pt-4 pb-8 border-2 border-indigo-500 space-y-3 shadow-lg">
                <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400">
                    BOOKMARKED COURSES
                </p>
                <div className="space-y-2">{classes}</div>
            </div>
        </motion.div>
    );
}

export default ScheduleBookmarksList;
