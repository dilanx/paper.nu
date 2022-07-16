import { Color } from '../../types/BaseTypes';
import {
    ScheduleInteractions,
    ScheduleModificationFunctions,
    ScheduleSection,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';
import { motion } from 'framer-motion';

interface SearchScheduleSectionProps {
    section: ScheduleSection;
    color: Color;
    sf: ScheduleModificationFunctions;
    interactions: ScheduleInteractions;
    alreadyAdded: boolean;
}

const variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

function SearchScheduleSection({
    section,
    color,
    sf,
    interactions,
    alreadyAdded,
}: SearchScheduleSectionProps) {
    return (
        <motion.div variants={variants} className={`w-full my-4`}>
            <button
                className={`w-full block text-left border-2 border-transparent
                bg-gray-200 dark:bg-gray-700 dark:text-white bg-opacity-50 rounded-lg ${
                    alreadyAdded
                        ? 'opacity-60 cursor-not-allowed'
                        : `hover:border-${color}-400`
                }`}
                onMouseEnter={() => {
                    if (!alreadyAdded) interactions.previewSection.set(section);
                }}
                onMouseLeave={() => {
                    if (!alreadyAdded) interactions.previewSection.clear();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!alreadyAdded) {
                        interactions.previewSection.clear();
                        sf.addSection(section);
                    }
                }}
            >
                <p className="px-2 text-md font-bold overflow-hidden whitespace-nowrap">
                    {section.section}
                    <span className="pl-2 text-sm font-normal">
                        {Utility.convertSectionComponent(section.component)}
                    </span>
                    {alreadyAdded && (
                        <span className="pl-2 text-xs font-normal text-red-600 dark:text-red-400">
                            already added
                        </span>
                    )}
                </p>
                <hr className="mx-2 border border-gray-400 opacity-50" />
                <div className="text-center py-4">
                    <p className="text-sm font-normal">
                        {section.meeting_days
                            ? Utility.convertAllDays(section.meeting_days)
                            : 'no days'}
                    </p>
                    <p className="text-md font-medium">
                        {section.start_time !== undefined &&
                        section.end_time !== undefined
                            ? Utility.convertTime(section.start_time, true) +
                              ' - ' +
                              Utility.convertTime(section.end_time, true)
                            : 'no times'}
                    </p>
                    <p className="text-sm font-light">
                        {section.instructors?.join(', ')}
                    </p>
                    <p className="text-sm font-light">
                        {section.room?.building_name ?? 'no location'}
                    </p>
                </div>
            </button>
        </motion.div>
    );
}

export default SearchScheduleSection;
