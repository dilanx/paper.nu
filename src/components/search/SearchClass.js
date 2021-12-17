import React from 'react';
import Utility from '../../Utility.js';
import { DragSource } from 'react-dnd'

const classSource = {

    beginDrag(props, monitor, component) {
        const item = { course: props.course }
        return item;
    }

}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class SearchClass extends React.Component {

    constructor(props) {
        super(props);

        // let prereqs = this.props.course.prereqs;

        // let prereq = [];

        // if (prereqs) {
        //     <div className={`bg-${color}-50 m-1 p-1 rounded-xl border border-${color}-500`} key={i + ' ' + j}>
        //                     <p className={`m-0 p-0 text-xs font-light text-${color}-500`}>
        //                         {prereqs[i][j]}
        //                     </p>
        //     </div>
        //     for (let i = 0; i < prereqs.length; i++) {
        //         for (let j = 0; j < prereqs[i].length; j++) {
        //             prereq.push(
                        
        //             )
        //         }
        //     }
        // }

        let distros = [];
        let distroStrings = Utility.convertDistros(this.props.course.distros);

        for (let i = 0; i < distroStrings.length; i++) {
            distros.push(
                <p className="m-0 p-0 text-xs text-gray-500 dark:text-gray-400 font-light" key={`distro-${i}`}>
                    {distroStrings[i]}
                </p>
            )
        }

        this.state = {
            distros: distros
        }

    }

    render() {
        const { isDragging, connectDragSource } = this.props;
        return connectDragSource(
            <div className={`p-2 rounded-lg bg-opacity-60 bg-${this.props.color}-100 dark:bg-gray-800
            rounded-lg border-2 border-${this.props.color}-300 border-opacity-60
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 m-4 cursor-pointer ${isDragging ? 'cursor-grab ' : 'cursor-pointer'}`}
            onClick={() => {
                if (this.props.select) this.props.select(this.props.course);
            }}>
                <p className="text-lg font-bold text-black dark:text-gray-50">
                    {this.props.course.id}
                </p>
                <p className="text-sm text-black dark:text-gray-50">
                    {this.props.course.name}
                </p>
                <p className="text-xs mt-4 text-gray-700 dark:text-gray-300">
                    {this.props.course.description}
                </p>
                {this.props.course.prereqs &&
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                            PREREQUISITES
                        </p>
                        <p className="m-0 p-0 text-xs text-gray-500 dark:text-gray-400 font-light">
                            {this.props.course.prereqs}
                        </p>
                    </div>
                }
                {this.state.distros.length > 0 &&
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                            DISTRIBUTION AREAS
                        </p>
                        {this.state.distros}
                    </div>
                }
            </div>
        )
    }

}

export default DragSource('Class', classSource, collect)(SearchClass);