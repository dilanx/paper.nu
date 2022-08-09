import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  ScheduleBookmarks,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ValidScheduleSection,
} from '../../types/ScheduleTypes';
import { getLayout } from '../../utility/Layout';
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
  sections?: ValidScheduleSection[];
  bookmarks: ScheduleBookmarks;
  alert: Alert;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
}

function Day(props: DayProps) {
  // TODO improve performance with memoization
  let hours: JSX.Element[] = [
    <Cell day={props.index} key={`day-${props.index}-x`} />,
  ];

  const { hourAssignments, layoutMap } = getLayout(props.sections);

  for (let i = props.start + 1; i <= props.end; i++) {
    const children = hourAssignments[i - 1]?.map((section) => (
      <ScheduleClass
        section={section}
        bookmarks={props.bookmarks}
        alert={props.alert}
        interactions={props.interactions}
        sf={props.sf}
        switches={props.switches}
        imageMode={props.imageMode}
        split={layoutMap[section.section_id]}
        key={`day-${props.index}-${section.section_id}`}
      />
    ));

    hours.push(<Cell key={`day-${props.index}-${i}`}>{children}</Cell>);
  }

  return <div className="flex flex-col">{hours}</div>;
}

export default Day;
