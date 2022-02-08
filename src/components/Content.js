import React from 'react';
import Year from './Year.js';
import Utility from '../Utility.js';

class Content extends React.Component { 

    render() {
        let content = this.props.content;
        let years = [];
        if (content) {
            years = content.map((year, index) => {
                return <Year title={Utility.convertYear(index) + ' YEAR'} content={year} yi={index} key={index}
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
                />;
            })
        }
        return (
            <div className='bg-white dark:bg-gray-800'>
                {years}
            </div>
        );
    }
}

export default Content;