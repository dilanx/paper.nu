import ScheduleManager from '../../ScheduleManager';
import {
    ScheduleInteractions,
    ScheduleSection,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';

interface ScheduleClassProps {
    section: ScheduleSection;
    interactions: ScheduleInteractions;
}

function ScheduleClass({ section, interactions }: ScheduleClassProps) {
    const { start_time, end_time, subject, number, title, instructors } =
        section;
    const color = ScheduleManager.getCourseColor(subject);
    const startDif = start_time.m / 60;
    const length =
        end_time.h * 60 + end_time.m - (start_time.h * 60 + start_time.m);
    const endDif = length / 60;
    const instructorLastNames = instructors
        .map((i) => i.split(' ').pop())
        .join(', ');
    return (
        <div
            className={`absolute w-full z-10 rounded-lg bg-opacity-60
                bg-${color}-100 border-2 border-l-4 border-${color}-400 overflow-visible
                cursor-pointer transition ease-in-out duration-300 ${
                    interactions.hoverSection.get === section.section_id
                        ? '-translate-y-2 shadow-lg'
                        : ''
                }`}
            style={{
                top: `${startDif * 100}%`,
                height: `calc(${endDif * 100}% + ${
                    2 * (end_time.h - start_time.h)
                }px)`,
            }}
            onMouseEnter={() => {
                interactions.hoverSection.set(section.section_id);
            }}
            onMouseLeave={() => {
                interactions.hoverSection.clear();
            }}
        >
            <div className="w-full h-full relative">
                <div className="w-full h-full overflow-scroll no-scrollbar p-2">
                    <p className="m-0 text-sm font-bold text-black overflow-hidden whitespace-nowrap">
                        {subject} {number}
                    </p>
                    <p className="m-0 text-xs text-black">{title}</p>
                    <p className="m-0 text-xs text-gray-500 opacity-75 font-light">
                        {instructorLastNames}
                    </p>
                </div>
                <p
                    className={`m-0 text-right text-xs absolute bottom-1 right-1 text-${color}-500 opacity-60 font-semibold`}
                >
                    {Utility.convertTime(start_time) +
                        ' - ' +
                        Utility.convertTime(end_time)}
                </p>
            </div>
        </div>
    );
}

export default ScheduleClass;
