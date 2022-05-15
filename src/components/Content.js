import React from 'react';
import Year from './Year.js';
import Utility from '../Utility.js';
import { PlusIcon } from '@heroicons/react/outline';

class Content extends React.Component {
    render() {
        let content = this.props.content;
        let years = [];
        if (content) {
            years = content.map((year, index) => {
                return (
                    <Year
                        title={Utility.convertYear(index) + ' YEAR'}
                        content={year}
                        yi={index}
                        key={index}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        addCourse={(course, quarter) => {
                            this.props.addCourse(course, index, quarter);
                        }}
                        delCourse={(courseIndex, quarter) => {
                            this.props.delCourse(courseIndex, index, quarter);
                        }}
                        moveCourse={this.props.moveCourse}
                        addSummerQuarter={this.props.addSummerQuarter}
                        favorites={this.props.favorites}
                        addFavorite={this.props.addFavorite}
                        delFavorite={this.props.delFavorite}
                    />
                );
            });
        }
        return (
            <div className="bg-white dark:bg-gray-800">
                {years}
                {this.props.allowAddYear && (
                    <button
                        className="block mx-auto m-5 px-8 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-500
                        dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300 transition-all duration-150 font-medium rounded-lg shadow-sm"
                        onClick={() => {
                            this.props.alert({
                                title: 'Add a year?',
                                message:
                                    'This will add another year to your plan. You can remove it by removing all classes from that year and refreshing the page.',
                                confirmButton: 'Add year',
                                confirmButtonColor: 'cyan',
                                cancelButton: 'Close',
                                iconBackgroundColor: 'cyan',
                                icon: (
                                    <PlusIcon
                                        className="h-6 w-6 text-cyan-600"
                                        aria-hidden="true"
                                    />
                                ),
                                action: () => {
                                    this.props.addYear();
                                },
                            });
                        }}
                    >
                        Add year
                    </button>
                )}
            </div>
        );
    }
}

export default Content;
