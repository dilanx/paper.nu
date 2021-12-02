import React from 'react';

class Info extends React.Component {

    render() {
        return (
            <div className="my-4 px-4 py-2 text-black whitespace-nowrap bg-purple-50 border-2 border-purple-800 rounded-3xl">
                <p className="text-xl font-light text-purple-800">
                    Plan Northwestern
                </p>
                <p className="text-sm font-light">
                    {this.props.version}
                </p>

            </div>
        )
    }

}

export default Info;