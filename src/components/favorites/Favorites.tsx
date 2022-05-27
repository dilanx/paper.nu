import React from 'react';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
    FavoritesData,
    PlanModificationFunctions,
} from '../../types/PlanTypes';
import FavoritesList from './FavoritesList';

interface FavoritesProps {
    favorites: FavoritesData;
    alert: Alert;
    f: PlanModificationFunctions;
    switches: UserOptions;
}

function Favorites(props: FavoritesProps) {
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
                favorites={props.favorites}
                alert={props.alert}
                f={props.f}
                switches={props.switches}
            />
            <FavoritesList
                credit={true}
                favorites={props.favorites}
                alert={props.alert}
                f={props.f}
                switches={props.switches}
            />
        </div>
    );
}

export default Favorites;
