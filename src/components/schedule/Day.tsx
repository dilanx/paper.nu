import { UserOptions } from '../../types/BaseTypes';
import {
    ScheduleInteractions,
    ScheduleModificationFunctions,
    ScheduleSection,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';
import ScheduleClass from './ScheduleClass';

function Cell({ day, children }: { day?: number; children?: React.ReactNode }) {
    return (
        <div className="w-full h-full border-dashed border-gray-200 dark:border-gray-600 border-b border-t first:border-t-0 last:border-b-2 flex justify-center items-center relative">
            {day !== undefined && (
                <p className="m-0 text-center text-gray-500 dark:text-gray-300">
                    {Utility.convertDay(day)}
                </p>
            )}
            {children}
        </div>
    );
}

interface DayProps {
    index: number;
    start: number;
    end: number;
    sections?: ScheduleSection[];
    interactions: ScheduleInteractions;
    sf: ScheduleModificationFunctions;
    switches: UserOptions;
}

function Day(props: DayProps) {
    let hours: JSX.Element[] = [
        <Cell day={props.index} key={`day-${props.index}-x`} />,
    ];
    for (let i = props.start + 1; i <= props.end; i++) {
        let children: JSX.Element[] = [];
        for (let section of props.sections || []) {
            if (section.start_time?.h === i - 1) {
                children.push(
                    <ScheduleClass
                        section={section}
                        interactions={props.interactions}
                        sf={props.sf}
                        switches={props.switches}
                        key={`day-${props.index}-${section.section_id}`}
                    />
                );
            }
        }
        hours.push(<Cell key={`day-${props.index}-${i}`}>{children}</Cell>);
    }

    return <div className="flex flex-col">{hours}</div>;
}

export default Day;
