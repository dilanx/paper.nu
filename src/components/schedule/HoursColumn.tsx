import Utility from '../../utility/Utility';

interface HoursColumnProps {
    start: number;
    end: number;
}

function HoursColumn({ start, end }: HoursColumnProps) {
    let hours: JSX.Element[] = [];
    for (let i = start; i <= end; i++) {
        hours.push(
            <div className="h-full relative" key={`hour-${i}`}>
                <p
                    className="m-0 pr-2 absolute bottom-0 translate-y-1/2 w-full
                        text-right text-sm text-gray-500 dark:text-gray-300"
                >
                    {Utility.convertHour(i)}
                </p>
            </div>
        );
    }

    return <div className="flex flex-col justify-between h-full">{hours}</div>;
}

export default HoursColumn;
