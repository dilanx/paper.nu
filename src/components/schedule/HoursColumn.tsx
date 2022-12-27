import Utility from '../../utility/Utility';

interface HoursColumnProps {
  start: number;
  end: number;
}

function HoursColumn({ start, end }: HoursColumnProps) {
  let hours: JSX.Element[] = [];
  for (let i = start; i <= end; i++) {
    hours.push(
      <div className="relative h-full" key={`hour-${i}`}>
        <p
          className="absolute bottom-0 m-0 w-full translate-y-1/2 pr-2
                        text-right text-sm text-gray-500 dark:text-gray-300"
        >
          {Utility.convertHour(i)}
        </p>
      </div>
    );
  }

  return <div className="flex h-full flex-col justify-between">{hours}</div>;
}

export default HoursColumn;
