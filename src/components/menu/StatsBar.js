import React from 'react';
import CourseManager from '../../CourseManager.js';

class StatsBar extends React.Component {

    render() {

        let units = CourseManager.getTotalCredits(this.props.data, this.props.favorites.forCredit);

        let unitString = 'units';
        if (units === 1) {
            unitString = 'unit';
        }

        return (
            <div className='border-2 border-gray-300 rounded-lg mt-2 mb-4 p-1 dark:border-gray-600'>
                <p className='text-center text-sm font-light text-gray-800 dark:text-gray-100'>
                    <span className='font-medium'>{units}</span> total {unitString}
                </p>
            </div>
        )

    }


}

export default StatsBar;