import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { Color } from '../../types/BaseTypes';
import {
    ScheduleCourse,
    ScheduleData,
    ScheduleInteractions,
    ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import SearchScheduleSection from './SearchScheduleSection';

interface SearchScheduleClassProps {
    course: ScheduleCourse;
    schedule: ScheduleData;
    color: Color;
    selected: boolean;
    select: () => void;
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

function SearchScheduleClass(props: SearchScheduleClassProps) {
    let course = props.course;

    let item = { course };

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'ScheduleClass',
            item,
            canDrag: !props.selected,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [props.selected]
    );

    return (
        <div
            ref={drag}
            className={`p-2 rounded-lg bg-opacity-60 dark:bg-gray-800 border-2
            ${
                props.selected
                    ? `bg-white border-${props.color}-400 shadow-lg -translate-y-2`
                    : `bg-${props.color}-100 border-${props.color}-300 border-opacity-60 hover:shadow-md hover:-translate-y-1`
            }
            group transition ease-in-out duration-300 m-4 cursor-pointer ${
                isDragging ? 'cursor-grab ' : 'cursor-pointer'
            }`}
            onClick={() => {
                if (props.select) props.select();
            }}
        >
            <p className="text-lg font-bold text-black dark:text-gray-50">
                {course.subject + ' ' + course.number}
            </p>
            <p className="text-sm text-black dark:text-gray-50">
                {course.title}
            </p>

            {props.selected && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className="px-2 py-4"
                >
                    {course.sections.map((section) => {
                        return (
                            <SearchScheduleSection
                                section={section}
                                color={props.color}
                                sf={props.sf}
                                interactions={props.interactions}
                                alreadyAdded={
                                    section.section_id in props.schedule
                                }
                                key={`search-${section.section_id}`}
                            />
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}

export default SearchScheduleClass;
