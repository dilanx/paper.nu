import React from 'react';

class Info extends React.Component {

    render() {
        return (
            <div className="my-4 px-4 text-black overflow-hidden whitespace-nowrap">
                <p className="text-lg font-bold text-purple-800">
                    Plan Northwestern (name still tbd)
                </p>
                <p className="text-sm">
                    {this.props.version}
                </p>
                <p className="text-xs">
                    This info part of the UI is still in dev lol
                </p>
            </div>
        )
    }

}

export default Info;