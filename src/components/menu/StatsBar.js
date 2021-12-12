import React from 'react';
import CourseManager from '../../CourseManager.js';

class StatsBar extends React.Component {

    render() {

        let units = CourseManager.getTotalCredits(this.props.data);


        let unitString = 'units';
        if (units === 1) {
            unitString = 'unit';
        }

        return (
            <div className="border-2 border-gray-300 rounded-lg mt-2 mb-4 p-1">
                <p className="text-center text-sm font-light text-gray-800">
                    <span className="font-medium">{units}</span> total {unitString}
                </p>
            </div>
        )

    }


}

export default StatsBar;