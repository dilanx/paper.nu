import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  ScheduleBookmarks,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  SectionWithValidMeetingPattern,
} from '../../types/ScheduleTypes';
import { SearchModificationFunctions } from '../../types/SearchTypes';
import { SideCard } from '../../types/SideCardTypes';
import { getLayout } from '../../utility/Layout';
import Utility from '../../utility/Utility';
import ScheduleClass from './ScheduleClass';

function Cell({ day, children }: { day?: number; children?: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center border-b border-t border-dashed border-gray-200 first:border-t-0 last:border-b-2 dark:border-gray-600">
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
  sections?: SectionWithValidMeetingPattern[];
  bookmarks: ScheduleBookmarks;
  alert?: Alert;
  sideCard?: SideCard;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
}

function Day(props: DayProps) {
  let hours: JSX.Element[] = [
    <Cell day={props.index} key={`day-${props.index}-x`} />,
  ];

  const { hourAssignments, layoutMap } = getLayout(props.sections);

  for (let i = props.start + 1; i <= props.end; i++) {
    const children = hourAssignments[i - 1]?.map((swmp) => (
      <ScheduleClass
        swmp={swmp}
        bookmarks={props.bookmarks}
        alert={props.alert}
        sideCard={props.sideCard}
        interactions={props.interactions}
        sf={props.sf}
        ff={props.ff}
        switches={props.switches}
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
