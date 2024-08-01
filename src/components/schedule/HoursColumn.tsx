import { Time } from '@/types/ScheduleTypes';
import { convertHour, convertTime } from '@/utility/Utility';
import { useMemo } from 'react';
import TimeIndicator from './TimeIndicator';

interface HoursColumnProps {
  start: number;
  end: number;
  time?: Time;
  imageMode?: boolean;
}

function HoursColumn({ start, end, time, imageMode }: HoursColumnProps) {
  const hours: JSX.Element[] = [];

  const [hour, minPercent, timeText] = useMemo(() => {
    if (!time) return [0, '0%', '12:00 AM'];
    return [
      time.h + 1,
      `calc(${(time.m / 60) * 100}% - 2px)`,
      convertTime({ h: time.h, m: time.m }, true),
    ];
  }, [time]);

  for (let i = start; i <= end; i++) {
    hours.push(
      <div className="relative h-full" key={`hour-${i}`}>
        <p className="absolute bottom-0 m-0 w-full translate-y-1/2 pr-2 text-right text-sm text-gray-500 dark:text-gray-300">
          {convertHour(i)}
        </p>
        {time && !imageMode && i != start && i === hour && (
          <TimeIndicator left={-8} top={minPercent}>
            {timeText}
          </TimeIndicator>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between">
      {hours}
      {time && !imageMode && (hour <= start || hour > end) && (
        <TimeIndicator dim left={26} top={28}>
          {timeText}
        </TimeIndicator>
      )}
    </div>
  );
}

export default HoursColumn;
