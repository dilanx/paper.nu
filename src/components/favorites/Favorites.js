import React from 'react';
import FavoritesList from './FavoritesList.js';

function Favorites(props) {
    return (
        <div
            className="border-4 border-indigo-300 my-2 rounded-lg shadow-lg h-full
            overflow-y-scroll no-scrollbar"
        >
            <p className="text-center text-2xl text-indigo-300 font-bold my-4">
                MY LIST
            </p>
            <FavoritesList
                credit={false}
                alert={props.alert}
                switches={props.switches}
                favorites={props.favorites}
                addFavorite={props.addFavorite}
                delFavorite={props.delFavorite}
            />
            <FavoritesList
                credit={true}
                alert={props.alert}
                switches={props.switches}
                favorites={props.favorites}
                addFavorite={props.addFavorite}
                delFavorite={props.delFavorite}
            />
        </div>
    );
}

export default Favorites;
