import {
  ScheduleInteractions,
  SectionWithValidMeetingPattern,
  TimeAndDay,
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
  time?: TimeAndDay;
  imageMode?: boolean;
}

function Day({
  index,
  start,
  end,
  sections,
  interactions,
  time,
  imageMode,
}: DayProps) {
  const hours: JSX.Element[] = [<Cell day={index} key={`day-${index}-x`} />];

  const { hourAssignments, layoutMap } = getLayout(sections);

  for (let i = start + 1; i <= end; i++) {
    const children = hourAssignments[i - 1]?.map((swmp) => (
      <ScheduleClass
        swmp={swmp}
        day={index}
        interactions={interactions}
        imageMode={imageMode}
        split={layoutMap[swmp.section.section_id][swmp.index]}
        key={`day-${index}-${swmp.section.section_id}-${swmp.index}`}
      />
    ));

    hours.push(
      <Cell key={`day-${index}-${i}`}>
        {children}
        {time && !imageMode && i === time.h + 1 && (
          <div
            className={`absolute left-0 z-30 h-0.5 w-full bg-emerald-500 ${
              index === 0 ? 'rounded-l-md' : index === 4 ? 'rounded-r-md' : ''
            } ${time.d === index ? 'opacity-75' : 'opacity-30'}`}
            style={{
              top: `${(time.m / 60) * 100}%`,
            }}
          />
        )}
      </Cell>
    );
  }

  return <div className="flex flex-col">{hours}</div>;
}

export default Day;
