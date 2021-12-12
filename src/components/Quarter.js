import React from 'react';
import Class from './Class.js';
import CourseManager from '../CourseManager.js';
import { DropTarget } from 'react-dnd';

const quarterTarget = {

    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        const item = monitor.getItem();
        if (item.from) {
            props.moveCourse(item.course, item.from.year, item.from.quarter, props.yi, props.qi);
        } else {
            props.addCourse(item.course);
        }
        return { moved: true };
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

class Quarter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovered: false
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

        let content = this.props.content;
        let classes = [];
        if (content) {
            if (content.length > 0) {
                classes = content.map((classData, index) => {
                    return <Class course={classData} key={index} yi={this.props.yi} qi={this.props.qi}
                    alert={this.props.alert}
                    switches={this.props.switches}
                    delCourse={() => {
                        this.props.delCourse(index);
                    }}/>
                })
            } else {
                classes = (
                    <div className={`p-2 compact:px-2 compact:py-0.5 rounded-lg bg-white border-2 border-dashed border-black
                    overflow-hidden whitespace-nowrap opacity-40`}>
                        <p className="text-md font-bold">
                            No classes to show.
                        </p>
                        <p className="compact:hidden text-xs">
                            Use the search bar.
                        </p>
                    </div>
                )
            }

        }

        let units = CourseManager.getQuarterCredits(content);

        let unitString = 'units';
        if (units === 1) {
            unitString = 'unit';
        }

        const { connectDropTarget } = this.props;

        return connectDropTarget(
            <div className={`relative block rounded-lg px-8 pt-4 pb-8 border-2
                ${this.state.hovered ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50` : `border-solid bg-${this.props.color}-50 border-${this.props.color}-400`}
                space-y-3 h-full shadow-lg compact:py-2 compact:shadow-sm`}>
                <p className="text-center font-bold text-md m-0 p-0 text-gray-600 compact:text-sm">
                    {this.props.title}
                </p>
                {classes}
                {this.props.switches.quarter_units &&
                    <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                        <span className="font-medium">{units}</span> {unitString}
                    </p>
                }
            </div>
        );
    }

}

export default DropTarget('Class', quarterTarget, collect)(Quarter);