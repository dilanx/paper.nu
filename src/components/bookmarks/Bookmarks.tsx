import React from 'react';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
    BookmarksData,
    PlanModificationFunctions,
} from '../../types/PlanTypes';
import BookmarksList from './BookmarksList';

interface BookmarksProps {
    bookmarks: BookmarksData;
    alert: Alert;
    f: PlanModificationFunctions;
    switches: UserOptions;
}

function Bookmarks(props: BookmarksProps) {
    return (
        <div
            className="border-4 border-indigo-300 my-2 rounded-lg shadow-lg h-full
            overflow-y-scroll no-scrollbar"
        >
            <p className="text-center text-2xl text-indigo-300 font-bold my-4">
                MY LIST
            </p>
            <BookmarksList
                credit={false}
                bookmarks={props.bookmarks}
                alert={props.alert}
                f={props.f}
                switches={props.switches}
            />
            <BookmarksList
                credit={true}
                bookmarks={props.bookmarks}
                alert={props.alert}
                f={props.f}
                switches={props.switches}
            />
        </div>
    );
}

export default Bookmarks;
