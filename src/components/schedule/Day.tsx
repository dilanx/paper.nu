import Utility from '../../utility/Utility';

function Cell({ day }: { day?: number }) {
    return (
        <div className="w-full h-full border-dashed border-gray-200 border-b border-t first:border-t-0 last:border-b-2 flex justify-center items-center">
            {day !== undefined && (
                <p className="m-0 text-center text-gray-500">
                    {Utility.convertDay(day)}
                </p>
            )}
        </div>
    );
}

interface DayProps {
    index: number;
    start: number;
    end: number;
}

function Day(props: DayProps) {
    let hours: JSX.Element[] = [
        <Cell day={props.index} key={`day-${props.index}-x`} />,
    ];
    for (let i = props.start + 1; i <= props.end; i++) {
        hours.push(<Cell key={`day-${props.index}-${i}`} />);
    }

    return <div className="flex flex-col">{hours}</div>;
}

export default Day;
