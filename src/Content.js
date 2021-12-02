import React from 'react';
import Year from './Year.js';
import Utility from './Utility.js';

class Content extends React.Component { 

    render() {
        let content = this.props.content;
        let years = [];
        if (content) {
            years = content.map((year, index) => {
                return <Year title={Utility.convertYear(index) + ' YEAR'} content={year} yi={index} key={index}
                addCourse={(course, quarter) => {
                    this.props.addCourse(course, index, quarter);
                }}
                delCourse={(courseIndex, quarter) => {
                    this.props.delCourse(courseIndex, index, quarter);
                }}
                addSummerQuarter={this.props.addSummerQuarter}
                />;
            })
        }
        return (
            <div className="col-span-6 block pt-0 h-screen md:overflow-scroll">
                {years}
            </div>
        );
    }
}

export default Content;