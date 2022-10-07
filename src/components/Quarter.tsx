import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import CourseManager from '../CourseManager';
import { Alert } from '../types/AlertTypes';
import { Color, UserOptions } from '../types/BaseTypes';
import {
    CourseDragItem,
    CourseLocation,
    Course,
    PlanModificationFunctions,
    BookmarksData,
    CourseDropResult,
    DropCollectedProps,
} from '../types/PlanTypes';
import Class from './Class';

interface QuarterProps {
    data: Course[];
    bookmarks: BookmarksData;
    location: CourseLocation;
    f: PlanModificationFunctions;
    alert: Alert;
    switches: UserOptions;
    title: string;
    color: Color;
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

function Quarter(props: QuarterProps) {
    const [{ isOver }, drop] = useDrop<
        CourseDragItem,
        CourseDropResult,
        DropCollectedProps
    >(() => ({
        accept: 'Class',
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            if (item.from) {
                props.f.moveCourse(item.course, item.from, props.location);
            } else {
                props.f.addCourse(item.course, props.location);
            }
            return { moved: true };
        },
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    }));

    let courses = props.data;
    let classes: JSX.Element[] | JSX.Element = [];
    if (courses) {
        if (courses.length > 0) {
            classes = courses.map((classData, index) => {
                return (
                    <Class
                        course={classData}
                        bookmarks={props.bookmarks}
                        alert={props.alert}
                        location={props.location}
                        f={props.f}
                        switches={props.switches}
                        key={classData.id + '-' + index}
                    />
                );
            });
        } else {
            classes = (
                <div
                    className="p-2 compact:px-2 compact:py-0.5 rounded-lg bg-white dark:bg-black border-2 border-dashed border-black dark:border-gray-500
                    overflow-hidden whitespace-nowrap opacity-40"
                >
                    <p className="text-md font-bold text-black dark:text-white">
                        No classes to show.
                    </p>
                    <p className="compact:hidden text-xs dark:text-white">
                        Use the search bar.
                    </p>
                </div>
            );
        }
    }

    let units = CourseManager.getQuarterCredits(courses);

    let unitString = 'units';
    if (units === 1) {
        unitString = 'unit';
    }

    return (
        <motion.div variants={variants}>
            <div
                ref={drop}
                className={`relative block rounded-lg px-8 pt-4 pb-8 border-2
            ${
                isOver
                    ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50`
                    : `border-solid bg-${props.color}-50 dark:bg-black border-${props.color}-400`
            }
                space-y-3 h-full shadow-lg compact:py-2 compact:shadow-sm`}
            >
                <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400 compact:text-sm">
                    {props.title}
                </p>
                {classes}
                {props.switches.get.quarter_units && (
                    <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                        <span className="font-medium">{units}</span>{' '}
                        {unitString}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

export default Quarter;
