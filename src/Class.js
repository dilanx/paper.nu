import React from "react";
import { DragSource } from 'react-dnd';
import Utility from "./Utility.js";
import { InformationCircleIcon, TrashIcon, DocumentIcon } from '@heroicons/react/outline';

const classSource = {

    beginDrag(props, monitor, component) {
        const item = { course: props.course }
        return item;
    },

    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }

        const dropResult = monitor.getDropResult();

        if (dropResult.moved) {
            props.delCourse();
        }
    }
  
  }
  
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Class extends React.Component {
    render() {

        let course = this.props.course;
        let color = Utility.getCourseColor(course.id);

        const { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div className={`p-2 rounded-lg bg-opacity-60 bg-${color}-100
            border-2 border-${color}-300 border-opacity-60 overflow-hidden whitespace-nowrap
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 group ${isDragging ? 'cursor-grab' : 'cursor-default'}`}>
                <p className="text-md font-bold">
                    {course.id}
                </p>
                <p className="text-xs overflow-hidden w-full block whitespace-nowrap overflow-ellipsis" title={course.name}>
                    {course.name}
                </p>
                <div className="absolute top-3 bottom-3 right-1 px-2 flex flex-row gap-2">
                    <button className="text-gray-800 text-xs opacity-20 hover:text-blue-500 hover:opacity-100
                    transition-all duration-150 hidden group-hover:block" onClick={() => {
                        this.props.alert({
                            title: course.id,
                            subtitle: course.name,
                            message: course.description,
                            confirmButton: 'Close',
                            confirmButtonColor: color,
                            iconBackgroundColor: color,
                            icon: (<DocumentIcon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />)
                        })
                    }}>
                        <InformationCircleIcon className="w-6 h-6"/>
                        
                    </button>
                    <button className="text-gray-800 text-xs opacity-20 hover:text-red-500 hover:opacity-100
                    transition-all duration-150 hidden group-hover:block" onClick={() => {
                        this.props.delCourse();
                    }}>
                        <TrashIcon className="w-6 h-6"/>
                        
                    </button>
                </div>
                
            </div>
        );
    }
}

export default DragSource('Class', classSource, collect)(Class);