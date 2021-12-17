import React from 'react';

class Info extends React.Component {

    render() {
        return (
            <div className="my-4 px-4 py-2 text-black text-center whitespace-nowrap bg-purple-50 dark:bg-gray-800 border-2 border-purple-800 rounded-3xl dark:border-purple-300">
                <p className="text-2xl font-normal text-purple-800 dark:text-purple-300">
                    Plan Northwestern
                </p>
                <p className="text-sm font-light text-black dark:text-white">
                    {this.props.version}
                </p>

            </div>
        )
    }

}

export default Info;