import {
  ScheduleInteractions,
  SectionWithValidMeetingPattern,
} from '@/types/ScheduleTypes';
import { getLayout } from '@/utility/Layout';
import { convertDay } from '@/utility/Utility';
import ScheduleClass from './ScheduleClass';

function Cell({ day, children }: { day?: number; children?: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center border-b border-t border-dashed border-gray-200 first:border-t-0 last:border-b-2 dark:border-gray-600">
      {day !== undefined && (
        <p className="m-0 text-center text-gray-500 dark:text-gray-300">
          {convertDay(day)}
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
  sections?: SectionWithValidMeetingPattern[];
  interactions?: ScheduleInteractions;
  imageMode?: boolean;
}

function Day(props: DayProps) {
  const hours: JSX.Element[] = [
    <Cell day={props.index} key={`day-${props.index}-x`} />,
  ];

  const { hourAssignments, layoutMap } = getLayout(props.sections);

  for (let i = props.start + 1; i <= props.end; i++) {
    const children = hourAssignments[i - 1]?.map((swmp) => (
      <ScheduleClass
        swmp={swmp}
        day={props.index}
        interactions={props.interactions}
        imageMode={props.imageMode}
        split={layoutMap[swmp.section.section_id][swmp.index]}
        key={`day-${props.index}-${swmp.section.section_id}-${swmp.index}`}
      />
    ));

    hours.push(<Cell key={`day-${props.index}-${i}`}>{children}</Cell>);
  }

  return <div className="flex flex-col">{hours}</div>;
}

export default Day;
