import React from 'react';
import CourseManager from '../../CourseManager.js';
import { DropTarget } from 'react-dnd';
import { XIcon } from '@heroicons/react/outline';

const contributionCourseTarget = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        const item = monitor.getItem();
        props.dragCourse(item.course, props.index);
        return { moved: false };
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType()
    }
}

function ContributionCourseOffered() {
    return (
        <div className="block">
            <p>This class is offered...</p>
            <div className="inline-block">
                <label className="p-1">
                    <input className="m-2"
                        type="checkbox" id="offered-fall" name="offered-fall" value="Test"/>
                    Fall quarter
                </label>
                <label className="p-1">
                    <input className="m-2"
                        type="checkbox" id="offered-winter" name="offered-winter" value="Test"/>
                    Winter quarter
                </label>
                <label className="p-1">
                    <input className="m-2"
                        type="checkbox" id="offered-spring" name="offered-spring" value="Test"/>
                    Spring quarter
                </label>
                <label className="p-1">
                    <input className="m-2"
                        type="checkbox" id="offered-summer" name="offered-summer" value="Test"/>
                    Summer quarter
                </label>
            </div>
        </div>
    )
}

class ContributionCourse extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovered: false,
            course: null
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOver && this.props.isOver) {
            this.setState({ hovered: true });
        }
      
        if (prevProps.isOver && !this.props.isOver) {
            this.setState({ hovered: false });
        }
    }

    render() {

        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div className={`relative grid gap-4 grid-cols-4 p-8 m-4 border-2 rounded-lg shadow-lg
                ${this.state.hovered ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50` : `border-solid bg-white dark:bg-gray-800 ${this.props.course ? `border-${CourseManager.getCourseColor(this.props.course.id)}-200` : `border-gray-400`}`}`}>
                
                {this.props.multiple &&
                    <button className="absolute right-1 top-1 p-1 px-2 bg-transparent text-gray-300 hover:text-red-400 focus:text-red-500"
                            title="Remove"
                            onClick={() => {
                                this.props.removeCourse(this.props.index);
                            }}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                        
                    }

                <div className="">
                    <p className="text-lg font-bold text-black dark:text-white">
                        {this.props.course ? this.props.course.id : 'SELECT A COURSE'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {this.props.course ? this.props.course.name : 'Drag a course here.'}
                    </p>
                </div>

                <div className="col-span-3 text-gray-700 text-sm space-y-4 dark:text-gray-300">

                    {this.props.course &&
                        <ContributionCourseOffered/>}

                </div>

                

            </div>
        )

    }

}

export default DropTarget('Class', contributionCourseTarget, collect)(ContributionCourse);