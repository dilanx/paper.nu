import React from 'react';
import Quarter from './Quarter.js';
import Utility from '../Utility.js';
import { PlusIcon } from '@heroicons/react/outline';

class Year extends React.Component {

    render() {

        let content = this.props.content;

        let quarters = [];
        if (content) {
            quarters = content.map((quarter, index) => {
                let {title, color} = Utility.convertQuarter(index);
                return <Quarter title={title} color={color} content={quarter} key={index} yi={this.props.yi} qi={index}
                    alert={this.props.alert}
                    switches={this.props.switches}
                    addCourse={course => {
                        this.props.addCourse(course, index);
                    }}
                    delCourse={courseIndex => {
                        this.props.delCourse(courseIndex, index);
                    }}
                    moveCourse={this.props.moveCourse}
                />
                
            })
        }

        return (

            <div className="relative p-4 border-4 border-gray-200 dark:border-gray-700 rounded-lg m-5 shadow-sm bg-white dark:bg-gray-800
                    compact:border-0 compact:shadow-none compact:my-0 compact:py-2">
                <p className="text-center text-2xl text-gray-300 font-bold pb-2 compact:text-sm compact:text-black dark:text-gray-500">
                    {this.props.title}
                </p>
                <div className={`grid grid-cols-1 ${quarters.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-12`}>
                    {quarters}
                </div>
                {quarters.length < 4 &&
                    <button className="absolute right-1 top-1 p-1 px-2 bg-transparent text-gray-300 dark:text-gray-500 hover:text-blue-400 focus:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-500"
                            title="Add summer quarter"
                            onClick={() => {
                                this.props.addSummerQuarter(this.props.yi);
                            }}>
                        <PlusIcon className="w-6 h-6"/>
                    </button>
                }
            </div>

        );
    }

}
export default Year;