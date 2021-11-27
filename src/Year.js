import React from 'react';
import Quarter from './Quarter.js';
import Utility from './Utility.js';

class Year extends React.Component {

    render() {

        let content = this.props.content;

        let quarters = [];
        if (content) {
            quarters = content.map((quarter, index) => {
                let {title, color} = Utility.convertQuarter(index);
                return <Quarter title={title} color={color} content={quarter} key={index}
                delClass={courseIndex => {
                    this.props.delClass(courseIndex, index);
                }}/>
            })
        }

        return (

            <div className="p-4 border-4 border-gray-200 rounded-lg m-5 shadow-sm bg-white">
                <p className="text-center text-2xl text-gray-300 font-bold pb-2">
                    {this.props.title}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {quarters}
                </div>
            </div>

        );
    }

}
export default Year;