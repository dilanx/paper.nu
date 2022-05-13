import React from 'react';
import Utility from '../../Utility.js';
import { useDrag } from 'react-dnd';

const PLACEHOLDER_MESSAGE = `Don't know which specific class to take from a certain requirement category? Use a placeholder! Search for 'placeholder' to view all.`;

function SearchClass(props) {
    let course = props.course;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'Class',
        item: { course },
        collect: monitor => ({ isDragging: monitor.isDragging() }),
    }));

    let distros = [];
    let distroStrings = Utility.convertDistros(course.distros);

    for (let i = 0; i < distroStrings.length; i++) {
        distros.push(
            <p
                className="m-0 p-0 text-xs text-gray-500 dark:text-gray-400 font-light"
                key={`distro-${i}`}
            >
                {distroStrings[i]}
            </p>
        );
    }

    let isPlaceholder = course.placeholder;
    let units = parseFloat(course.units);
    return (
        <div
            ref={drag}
            className={`p-2 rounded-lg bg-opacity-60 bg-${
                props.color
            }-100 dark:bg-gray-800
            rounded-lg border-2 border-${props.color}-300 border-opacity-60
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 m-4 cursor-pointer ${
                isDragging ? 'cursor-grab ' : 'cursor-pointer'
            }`}
            onClick={() => {
                if (props.select) props.select(course);
            }}
        >
            <p className="text-lg font-bold text-black dark:text-gray-50">
                {isPlaceholder ? course.name : course.id}
            </p>
            <p className="text-sm text-black dark:text-gray-50">
                {isPlaceholder ? 'PLACEHOLDER' : course.name}
            </p>
            <p className="text-xs mt-4 text-gray-700 dark:text-gray-300">
                {isPlaceholder ? PLACEHOLDER_MESSAGE : course.description}
            </p>
            {course.prereqs && (
                <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                        PREREQUISITES
                    </p>
                    <p className="m-0 p-0 text-xs text-gray-500 dark:text-gray-400 font-light">
                        {course.prereqs}
                    </p>
                </div>
            )}
            {distros.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                        DISTRIBUTION AREAS
                    </p>
                    {distros}
                </div>
            )}
            <div className="mt-1">
                <p className="text-xs text-right text-gray-500 dark:text-gray-400 font-light">
                    <span className="font-medium">{units}</span>{' '}
                    {units === 1 ? 'unit' : 'units'}
                </p>
            </div>
        </div>
    );
}

export default SearchClass;
