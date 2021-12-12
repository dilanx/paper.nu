import React from 'react';
import CourseManager from '../../CourseManager.js';
import { DropTarget } from 'react-dnd';
import { PencilIcon, XIcon } from '@heroicons/react/outline';

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

function ContributionCoursePrereqs(props) {

    let inputs = [];
    for (let i = 0; i < 4; i++) {
        inputs.push(
            <input className="m-1 p-1 text-xs inline-block bg-white bg-opacity-50 border-2 border-gray-300 rounded-lg hover:border-gray-400
                focus:border-red-400 focus:outline-none"
                type="text"
                key={`cc-prereq-${i}`}/>
        )
    }

    return (
        <div className="block">
            <p>
                This class's prerequisites <span className="font-bold">paths</span> are...
                <span className="pl-4">
                    <button className="text-xs text-gray-400 hover:text-red-500"
                        onClick={() => {
                            props.alert({
                                title: 'Contribution Guide',
                                subtitle: 'Prerequisite paths',
                                message: 'A prerequisite path is a list of courses, ALL of which must be taken to take this class. At least one fulfilled prereq path counts as having the necessary prereqs to take the class. For example, CS 214 strictly requires that CS 111 must be taken, but allows you to pick between CS 211 and CS 150 as the other prerequisite. So, the two prereq paths would be "COMP_SCI 111-0, COMP_SCI 211-0" and "COMP_SCI 111-0, COMP_SCI 150-0". You can add up to 4 separate prereq paths, but you should rarely need them all.',
                                confirmButton: 'Okay',
                                confirmButtonColor: 'rose',
                                iconBackgroundColor: 'rose',
                                icon: <PencilIcon className="h-6 w-6 text-rose-600" aria-hidden="true" />
                            })
                        }}>
                        what are prereq paths?
                    </button>
                </span>
            </p>
            <p className="text-xs italic">
                (separate each course in each path with a comma)
            </p>
            {inputs}

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
                ${this.state.hovered ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50` : `border-solid bg-white ${this.props.course ? `border-${CourseManager.getCourseColor(this.props.course.id)}-200` : `border-gray-400`}`}`}>
                
                {this.props.multiple &&
                    <button className="absolute right-1 top-1 p-1 px-2 bg-white text-gray-300 hover:text-red-400 focus:text-red-500"
                            title="Remove"
                            onClick={() => {
                                this.props.removeCourse(this.props.index);
                            }}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                        
                    }

                <div className="">
                    <p className="text-lg font-bold text-black">
                        {this.props.course ? this.props.course.id : 'SELECT A COURSE'}
                    </p>
                    <p className="text-sm text-gray-600">
                        {this.props.course ? this.props.course.name : 'Drag a course here.'}
                    </p>
                </div>

                <div className="col-span-3 text-gray-700 text-sm space-y-4">

                    {this.props.course &&
                        <ContributionCourseOffered/>}

                    {this.props.course &&
                        <ContributionCoursePrereqs alert={this.props.alert}/>}

                </div>

                

            </div>
        )

    }

}

export default DropTarget('Class', contributionCourseTarget, collect)(ContributionCourse);