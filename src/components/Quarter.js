import React from 'react';
import Class from './Class.js';
import CourseManager from '../CourseManager.js';
import { useDrop } from 'react-dnd';

function Quarter(props) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'Class',
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            if (item.from) {
                props.moveCourse(
                    item.course,
                    item.from.year,
                    item.from.quarter,
                    props.yi,
                    props.qi
                );
            } else {
                props.addCourse(item.course);
            }
            return { moved: true };
        },
        collect: monitor => ({ isOver: monitor.isOver() }),
    }));

    let content = props.content;
    let classes = [];
    if (content) {
        if (content.length > 0) {
            classes = content.map((classData, index) => {
                return (
                    <Class
                        course={classData}
                        key={index}
                        yi={props.yi}
                        qi={props.qi}
                        alert={props.alert}
                        switches={props.switches}
                        favorites={props.favorites}
                        addFavorite={props.addFavorite}
                        delFavorite={props.delFavorite}
                        delCourse={() => {
                            props.delCourse(index);
                        }}
                    />
                );
            });
        } else {
            classes = (
                <div
                    className="p-2 compact:px-2 compact:py-0.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-black dark:border-gray-500
                    overflow-hidden whitespace-nowrap opacity-40"
                >
                    <p className="text-md font-bold text-black dark:text-white">
                        No classes to show.
                    </p>
                    <p className="compact:hidden text-xs dark:text-white">
                        Use the search bar.
                    </p>
                </div>
            );
        }
    }

    let units = CourseManager.getQuarterCredits(content);

    let unitString = 'units';
    if (units === 1) {
        unitString = 'unit';
    }

    return (
        <div
            ref={drop}
            className={`relative block rounded-lg px-8 pt-4 pb-8 border-2
            ${
                isOver
                    ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50`
                    : `border-solid bg-${props.color}-50 dark:bg-gray-800 border-${props.color}-400`
            }
                space-y-3 h-full shadow-lg compact:py-2 compact:shadow-sm`}
        >
            <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400 compact:text-sm">
                {props.title}
            </p>
            {classes}
            {props.switches.quarter_units && (
                <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                    <span className="font-medium">{units}</span> {unitString}
                </p>
            )}
        </div>
    );
}

export default Quarter;
