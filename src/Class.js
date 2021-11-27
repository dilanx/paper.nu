import React from "react";

class Class extends React.Component {
    render() {
        return (
            <div className={`p-2 rounded-lg bg-opacity-60 bg-${this.props.color}-100
            border-2 border-${this.props.color}-300 border-opacity-60 overflow-scroll whitespace-nowrap
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 group`}>
                <p className="text-md font-bold">
                    {this.props.id}
                </p>
                <p className="text-xs">
                    {this.props.name}
                </p>
                <button className="absolute top-3 bottom-3 right-1 px-2 rounded-lg
                border-2 border-dotted border-gray-800 text-gray-800 text-xs opacity-20
                hover:border-red-500 hover:text-red-500 hover:opacity-100
                transition-all duration-150 hidden group-hover:block" onClick={() => {
                    this.props.delClass();
                }}>
                    del
                </button>
            </div>
        );
    }
}

export default Class;