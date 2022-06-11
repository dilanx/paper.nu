import React from 'react';
import Quarter from './Quarter';
import Utility from '../Utility';
import {
    PlusIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from '@heroicons/react/outline';
import {
    Course,
    BookmarksData,
    PlanModificationFunctions,
    PlanSpecialFunctions,
} from '../types/PlanTypes';
import { Alert } from '../types/AlertTypes';
import { UserOptions } from '../types/BaseTypes';

interface YearProps {
    data: Course[][];
    bookmarks: BookmarksData;
    year: number;
    f: PlanModificationFunctions;
    f2: PlanSpecialFunctions;
    alert: Alert;
    switches: UserOptions;
    title: string;
}

interface YearState {
    hidden: boolean;
}

class Year extends React.Component<YearProps, YearState> {
    constructor(props: YearProps) {
        super(props);

        this.state = {
            hidden: false,
        };
    }

    render() {
        let content = this.props.data;

        let quarters: JSX.Element[] = [];
        if (content) {
            quarters = content.map((quarter, index) => {
                let { title, color } = Utility.convertQuarter(index);
                return (
                    <Quarter
                        data={quarter}
                        bookmarks={this.props.bookmarks}
                        location={{ year: this.props.year, quarter: index }}
                        f={this.props.f}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        title={title}
                        color={color}
                        key={this.props.year + '-' + index}
                    />
                );
            });
        }

        return (
            <div
                className="relative p-4 border-4 border-gray-200 dark:border-gray-700 rounded-lg m-5 shadow-sm bg-white dark:bg-gray-800
                    compact:border-0 compact:shadow-none compact:my-0 compact:py-2"
            >
                <p
                    className={`text-center text-2xl text-gray-300 font-bold compact:text-sm compact:text-black dark:text-gray-500 ${
                        this.state.hidden ? '' : 'pb-2'
                    }`}
                >
                    {this.props.title}
                </p>
                {!this.state.hidden && (
                    <div
                        className={`grid grid-cols-1 ${
                            quarters.length === 4
                                ? 'lg:grid-cols-4'
                                : 'lg:grid-cols-3'
                        } gap-12`}
                    >
                        {quarters}
                    </div>
                )}
                <div className="absolute right-1 top-1 text-gray-300 dark:text-gray-500">
                    {quarters.length < 4 && (
                        <button
                            className="inline-block p-1 bg-transparent hover:text-yellow-300 dark:hover:text-yellow-300"
                            title="Add summer quarter"
                            onClick={() => {
                                this.props.f2.addSummerQuarter(this.props.year);
                            }}
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button
                        className="inline-block p-1 bg-transparent hover:text-red-400 dark:hover:text-red-400"
                        title={
                            this.state.hidden
                                ? "Show this year's courses"
                                : "Hide this year's courses"
                        }
                        onClick={() => {
                            this.setState({ hidden: !this.state.hidden });
                        }}
                    >
                        {this.state.hidden ? (
                            <ChevronDownIcon className="w-6 h-6" />
                        ) : (
                            <ChevronUpIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
}
export default Year;
