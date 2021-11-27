import React from 'react';
import Year from './Year.js';
import Utility from './Utility.js';

class Content extends React.Component { 

    render() {
        let content = this.props.content;
        let years = [];
        if (content) {
            years = content.map((year, index) => {
                return <Year title={Utility.convertYear(index) + ' YEAR'} content={year} key={index}
                delClass={(courseIndex, quarter) => {
                    this.props.delClass(courseIndex, index, quarter);
                }}/>;
            })
        }
        return (
            <div className="col-span-6 block pt-20 md:pt-0">
                {years}
            </div>
        );
    }
}

export default Content;