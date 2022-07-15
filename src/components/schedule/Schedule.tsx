import React from 'react';
import {
    ScheduleInteractions,
    ScheduleSection,
} from '../../types/ScheduleTypes';
import Day from './Day';
import HoursColumn from './HoursColumn';

interface ScheduleProps {}

interface ScheduleState {
    interactions: ScheduleInteractions;
}

class Schedule extends React.Component<ScheduleProps, ScheduleState> {
    constructor(props: ScheduleProps) {
        super(props);

        this.state = {
            interactions: {
                hoverSection: {
                    set: (id) => this.interactionUpdateHoverSection(id),
                    clear: () => this.interactionUpdateHoverSection(),
                },
            },
        };
    }

    interactionUpdateHoverSection(id?: string) {
        this.setState({
            interactions: {
                ...this.state.interactions,
                hoverSection: {
                    ...this.state.interactions.hoverSection,
                    get: id,
                },
            },
        });
    }

    render() {
        let days: JSX.Element[] = [];
        for (let i = 0; i < 5; i++) {
            days.push(
                <Day
                    index={i}
                    start={9}
                    end={18}
                    interactions={this.state.interactions}
                    key={`day-${i}`}
                />
            );
        }

        // TODO testing

        const test = (day: number) => (
            <Day
                index={day}
                start={9}
                end={18}
                interactions={this.state.interactions}
                sections={
                    [
                        {
                            section_id: '12345-20',
                            start_time: { h: 12, m: 30 },
                            end_time: { h: 13, m: 50 },
                            subject: 'COMP_SCI',
                            number: '211-0',
                            title: 'Fundamentals of Computer Programming II',
                            instructors: [
                                'Sruti Sakuntala Bhagavatula',
                                'Joseph Edward Hummel',
                            ],
                        },
                    ] as ScheduleSection[]
                }
                key={`day-${day}`}
            />
        );

        days[1] = test(1);
        days[3] = test(3);

        return (
            <div className="h-full relative p-4">
                <div
                    className="p-4 border-4 border-green-200 bg-green-50 bg-opacity-50 border-opacity-75 h-192 lg:h-full rounded-lg shadow-md grid
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
