import React from 'react';
import FavoritesList from './FavoritesList.js';

class Favorites extends React.Component {
    render() {
        return (
            <div className="relative block p-4 border-4 border-indigo-200 rounded-lg m-5 shadow-sm bg-white dark:bg-gray-800">
                <p className="text-center text-2xl text-indigo-300 font-bold pb-2">
                    MY LIST
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <FavoritesList
                        credit={false}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        favorites={this.props.favorites}
                        addFavorite={this.props.addFavorite}
                        delFavorite={this.props.delFavorite}
                    />
                    <FavoritesList
                        credit={true}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        favorites={this.props.favorites}
                        addFavorite={this.props.addFavorite}
                        delFavorite={this.props.delFavorite}
                    />
                </div>
            </div>
        );
    }
}

export default Favorites;
