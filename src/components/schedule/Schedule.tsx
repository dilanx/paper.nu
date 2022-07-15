import React from 'react';
import Day from './Day';
import HoursColumn from './HoursColumn';

class Schedule extends React.Component {
    render() {
        let days: JSX.Element[] = [];
        for (let i = 0; i < 5; i++) {
            days.push(<Day index={i} start={9} end={18} key={`day-${i}`} />);
        }

        return (
            <div className="h-full relative p-4">
                <div
                    className="p-4 border-4 border-green-200 bg-green-50 h-192 lg:h-full rounded-lg shadow-md grid
                        grid-cols-[3.2rem_repeat(5,_minmax(0,_1fr))]"
                >
                    <HoursColumn start={9} end={18} />
                    {days}
                </div>
            </div>
        );
    }
}

export default Schedule;
