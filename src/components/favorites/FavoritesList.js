import React from 'react';
import { useDrop } from 'react-dnd';
import Class from '../Class.js';
import CourseManager from '../../CourseManager.js';

function FavoritesList(props) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'Class',
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            props.addFavorite(item.course, props.credit);
        },
        collect: monitor => ({ isOver: monitor.isOver() }),
    }));

    let content = props.credit
        ? Array.from(props.favorites.forCredit)
        : Array.from(props.favorites.noCredit);
    let classes = [];
    if (content.length > 0) {
        classes = content.map((classData, index) => {
            return (
                <Class
                    course={classData}
                    key={index}
                    yi={-1}
                    qi={-1}
                    alert={props.alert}
                    switches={props.switches}
                    favorites={props.favorites}
                    delCourse={() => {
                        props.delFavorite(classData, props.credit);
                    }}
                    addFavorite={() => {
                        props.addFavorite(classData, false);
                    }}
                    delFavorite={() => {
                        props.delFavorite(classData, false);
                    }}
                />
            );
        });
    } else {
        classes = (
            <div className={`text-center overflow-hidden whitespace-normal`}>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    {props.credit
                        ? `Classes here are counted towards total credit (like classes you've received AP/IB credit for).`
                        : `Find a class you're interested in but don't have a spot for it on your schedule yet? Bookmark it for later by dragging it here.`}
                </p>
            </div>
        );
    }

    let units = CourseManager.getExtraCredits(content);

    let unitString = 'units';
    if (units === 1) {
        unitString = 'unit';
    }

    return (
        <div
            ref={drop}
            className={`compact-mode relative m-4 rounded-lg px-4 pt-4 pb-8 border-2
                    ${
                        isOver
                            ? 'border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50'
                            : `border-solid bg-gray-50 dark:bg-gray-800
                        ${
                            props.credit
                                ? 'border-indigo-800 dark:border-indigo-400'
                                : 'border-indigo-500'
                        }`
                    }
                    space-y-3 shadow-lg`}
        >
            <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400">
                {props.credit ? 'FOR CREDIT' : 'BOOKMARKED COURSES'}
            </p>
            <div>{classes}</div>
            {props.credit && props.switches.quarter_units && (
                <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                    <span className="font-medium">{units}</span> {unitString}
                </p>
            )}
        </div>
    );
}

export default FavoritesList;
