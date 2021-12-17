import React from "react";
import { DragSource } from 'react-dnd';
import CourseManager from '../CourseManager.js';
import Utility from '../Utility.js';
import { InformationCircleIcon, TrashIcon, DocumentIcon } from '@heroicons/react/outline';

const classSource = {

    beginDrag(props, monitor, component) {
        const item = {
            course: props.course,
            from: {
                year: props.yi,
                quarter: props.qi
            }
        }
        return item;
    }
  
  }
  
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Class extends React.Component {

    openInfo() {
        let course = this.props.course;
        let color = CourseManager.getCourseColor(course.id);

        if (course.placeholder) {
            this.props.alert({
                title: 'Placeholder',
                subtitle: course.name,
                message: `If you aren't sure which course to take to fulfill a certain requirement, you can use a placeholder! Search using 'placeholder' or by requirement category to find placeholders.`,
                confirmButton: 'Close',
                confirmButtonColor: color,
                iconBackground: color,
                icon: (<DocumentIcon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />),
            })
            return;
        }

        let extras = [];

        if (course.prereqs) {
            extras.push(
                {
                    title: 'PREREQUISITES',
                    content: course.prereqs
                }
            )
        }

        if (course.distros) {
            let distros = Utility.convertDistros(course.distros);
            extras.push(
                {
                    title: 'DISTRIBUTION AREAS',
                    content: distros.join(', ')
                }
            )
        }

        this.props.alert({
            title: course.id,
            subtitle: course.name,
            message: course.description,
            confirmButton: 'Close',
            confirmButtonColor: color,
            iconBackgroundColor: color,
            icon: (<DocumentIcon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />),
            extras: extras
        })
    }

    render() {

        let course = this.props.course;
        let color = CourseManager.getCourseColor(course.id);

        const { isDragging, connectDragSource } = this.props;

        let showMoreInfo = this.props.switches.more_info && !this.props.switches.compact;

        let isPlaceholder = course.placeholder;

        return connectDragSource(
            <div className={`p-2 rounded-lg bg-opacity-60 bg-${color}-100 dark:bg-gray-800
            border-2 border-${color}-300 border-opacity-60 overflow-hidden whitespace-nowrap
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 group ${isDragging ? 'cursor-grab' : 'cursor-default'}
            compact:px-2 compact:py-0.5`}>
                <p className={`text-md ${isPlaceholder ? 'font-normal' : 'font-bold'} text-black dark:text-gray-50 compact:text-sm`}>
                    {isPlaceholder ? course.name : course.id}
                </p>
                <p className={`text-xs ${isPlaceholder ? 'font-light' : 'font-normal'} text-black dark:text-gray-50 overflow-hidden w-full block whitespace-nowrap overflow-ellipsis compact:hidden`} title={course.name}>
                    {isPlaceholder ? 'PLACEHOLDER' : course.name}
                </p>
                {showMoreInfo &&
                    <div>
                        {course.prereqs &&
                            <div className="mt-4 text-gray-500 dark:text-gray-400">
                                <p className="text-xs font-bold">
                                    PREREQUISITES
                                </p>
                                <p className="m-0 p-0 text-xs font-light whitespace-normal">
                                    {course.prereqs}
                                </p>
                            </div>
                        }
                        {course.distros &&
                            <div className="mt-4 text-gray-500 dark:text-gray-400">
                                <p className="text-xs font-bold">
                                    DISTRIBUTION AREAS
                                </p>
                                <p className="m-0 p-0 text-xs font-light whitespace-normal">
                                    {Utility.convertDistros(course.distros).join(', ')}
                                </p>
                            </div>
                        }
                    </div>
                }
                <div className="absolute top-3 bottom-3 compact:top-0.5 compact:bottom-0.5 right-1 px-2 flex flex-row gap-2">
                    <button className="text-gray-500 dark:text-white text-xs opacity-40 hover:text-blue-500 dark:hover:text-blue-500 hover:opacity-100
                    transition-all duration-150 hidden group-hover:block" onClick={() => {
                        this.openInfo();
                    }}>
                        <InformationCircleIcon className="w-6 h-6 compact:w-5 compact:h-5"/>
                        
                    </button>
                    <button className="text-gray-500 dark:text-white text-xs opacity-40 hover:text-red-500 dark:hover:text-red-500 hover:opacity-100
                    transition-all duration-150 hidden group-hover:block" onClick={() => {
                        this.props.delCourse();
                    }}>
                        <TrashIcon className="w-6 h-6 compact:w-5 compact:h-5"/>
                        
                    </button>
                </div>
                
            </div>
        );
    }
}

export default DragSource('Class', classSource, collect)(Class);