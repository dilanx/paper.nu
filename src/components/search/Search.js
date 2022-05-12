import React from 'react';
import SearchClass from './SearchClass.js';
import AddButtons from './AddButtons.js';
import CourseManager from '../../CourseManager.js';
import {
    SearchIcon,
    BookOpenIcon,
    ArrowRightIcon,
    SaveIcon,
    DotsHorizontalIcon,
} from '@heroicons/react/outline';

const SEARCH_RESULT_LIMIT = 100;
var shortcut = null;

function MiniContentBlock(props) {
    return (
        <div className="text-center p-4">
            <div className="mx-auto my-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {props.icon}
            </div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {props.title}
            </p>
            <p className="text-sm font-light text-gray-400 dark:text-gray-500">
                {props.text}
            </p>
        </div>
    );
}

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            current: null,
            shortcut: null,
        };
    }

    searchMessage(title, subtitle) {
        return (
            <div className="text-center text-gray-600 dark:text-gray-400 px-4">
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm font-light">{subtitle}</p>
            </div>
        );
    }

    getResults() {
        let search = this.state.search.toLowerCase();
        shortcut = null;

        if (search.length === 0) {
            return (
                <div>
                    <MiniContentBlock
                        icon={<SearchIcon className="w-6 h-6" />}
                        title="Search"
                        text="Use the search bar to search across every course at Northwestern."
                    />
                    <MiniContentBlock
                        icon={<BookOpenIcon className="w-6 h-6" />}
                        title="Learn"
                        text="Get information like the course description, prerequisites, and more, all from right here."
                    />
                    <MiniContentBlock
                        icon={<ArrowRightIcon className="w-6 h-6" />}
                        title="Drag"
                        text="Drag courses from this search area into the quarter you want. Alternatively, you can click on the course and select the quarter you want to add it to."
                    />
                    <MiniContentBlock
                        icon={<SaveIcon className="w-6 h-6" />}
                        title="Save and share"
                        text="The URL updates as you modify your plan. Save it somewhere or share it with others."
                    />
                </div>
            );
        }

        search = search.replace(/-|_/g, ' ');

        let terms = [search];

        let firstWord = search.split(' ')[0];
        if (CourseManager.data.shortcuts[firstWord]) {
            let shortcuts = CourseManager.data.shortcuts[firstWord];
            let remainder = search.substring(firstWord.length + 1);
            terms = shortcuts.map(shortcut => {
                return (
                    shortcut.toLowerCase().replace(/-|_/, ' ') + ' ' + remainder
                );
            });

            shortcut = {
                replacing: firstWord.toUpperCase(),
                with: shortcuts.join(', '),
            };
        }

        for (let term of terms) {
            if (term.length < 3) {
                return this.searchMessage(
                    'Keep typing...',
                    `You'll need at least 3 characters.`
                );
            }
        }

        let courseIdResults = [];
        let courseNameResults = [];

        CourseManager.data.courses.forEach(course => {
            for (let term of terms) {
                if (
                    course.id.toLowerCase().replace(/-|_/g, ' ').includes(term)
                ) {
                    courseIdResults.push(course);
                } else if (
                    course.name
                        .toLowerCase()
                        .replace(/-|_/g, ' ')
                        .includes(term)
                ) {
                    courseNameResults.push(course);
                }
            }
        });

        let total = courseIdResults.length + courseNameResults.length;

        if (total === 0) {
            return this.searchMessage(
                'Aw, no results.',
                `Try refining your search.`
            );
        }

        let limitExceeded = false;

        if (total > SEARCH_RESULT_LIMIT) {
            limitExceeded = true;
            if (courseIdResults.length > SEARCH_RESULT_LIMIT) {
                courseIdResults = courseIdResults.slice(0, SEARCH_RESULT_LIMIT);
                courseNameResults = [];
            } else {
                courseNameResults = courseNameResults.slice(
                    0,
                    SEARCH_RESULT_LIMIT - courseIdResults.length
                );
            }
        }

        courseIdResults.sort((a, b) => a.id.localeCompare(b.id));
        courseNameResults.sort((a, b) => a.name.localeCompare(b.name));

        let filtered = courseIdResults.concat(courseNameResults);

        let courseList = [];
        for (let course of filtered) {
            courseList.push(
                <SearchClass
                    color={CourseManager.getCourseColor(course.id)}
                    course={course}
                    key={course.id}
                    select={classData => {
                        this.setState({ current: classData });
                    }}
                />
            );
        }

        if (limitExceeded) {
            courseList.push(
                <MiniContentBlock
                    icon={<DotsHorizontalIcon className="w-6 h-6" />}
                    title={`and ${total - SEARCH_RESULT_LIMIT} more.`}
                    text="There are too many results to display. You'll need to narrow your search to get more."
                    key="too-many"
                />
            );
        }

        return courseList;
    }

    render() {
        let singleClassView = false;

        let results = this.getResults();

        let searchField = (
            <div className="sticky top-0 p-2 mb-2 bg-white dark:bg-gray-800 z-10 rounded-lg">
                <input
                    className="block mt-4 mb-2 mx-auto w-11/12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-md
                rounded-lg outline-none hover:border-gray-500 focus:border-black dark:hover:border-gray-400 dark:focus:border-white text-lg p-2 px-4
                transition-all duration-150 text-black dark:text-white"
                    value={this.state.search}
                    placeholder="Search for classes..."
                    onChange={event => {
                        this.setState({ search: event.target.value });
                    }}
                />
                {shortcut && (
                    <p className="text-center text-sm m-0 p-0 text-gray-500 dark:text-gray-400">
                        replacing{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.replacing}
                        </span>{' '}
                        with{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.with}
                        </span>
                    </p>
                )}
            </div>
        );

        let selectedClass = null;
        let addButtons = null;
        let favoritesButtons = null;
        let exitButton = null;

        if (this.state.current) {
            singleClassView = true;

            selectedClass = (
                <SearchClass
                    color={CourseManager.getCourseColor(this.state.current.id)}
                    course={this.state.current}
                />
            );

            addButtons = (
                <AddButtons
                    action={(year, quarter) => {
                        this.props.addCourse(this.state.current, year, quarter);
                        this.setState({ current: null });
                    }}
                    data={this.props.data}
                />
            );

            let favorites = this.props.favorites;

            favoritesButtons = (
                <div className="py-2">
                    <p className="text-center text-gray-500 font-bold p-2 text-sm">
                        MY LIST
                    </p>
                    <button
                        className="block mx-auto bg-indigo-500 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-lg"
                        onClick={() => {
                            if (favorites.noCredit.has(this.state.current)) {
                                this.props.delFavorite(
                                    this.state.current,
                                    false
                                );
                            } else {
                                this.props.addFavorite(
                                    this.state.current,
                                    false
                                );
                            }
                        }}
                    >
                        {favorites.noCredit.has(this.state.current)
                            ? 'Remove from bookmarks'
                            : 'Add to bookmarks'}
                    </button>
                    <button
                        className="block mx-auto bg-indigo-800 dark:bg-indigo-400 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-lg"
                        onClick={() => {
                            if (favorites.forCredit.has(this.state.current)) {
                                this.props.delFavorite(
                                    this.state.current,
                                    true
                                );
                            } else {
                                this.props.addFavorite(
                                    this.state.current,
                                    true
                                );
                            }
                        }}
                    >
                        {favorites.forCredit.has(this.state.current)
                            ? 'Remove for credit'
                            : 'Add for credit'}
                    </button>
                </div>
            );

            exitButton = (
                <button
                    className="block mx-auto my-8 bg-gray-500 text-white font-medium
                        w-4/5 p-2 opacity-100 hover:opacity-60 transition-all duration-150 rounded-md shadow-lg"
                    onClick={() => {
                        this.setState({ current: null });
                    }}
                >
                    Back
                </button>
            );
        }

        return (
            <div
                className="border-4 border-gray-400 dark:border-gray-500 mt-4 mb-2 rounded-lg shadow-lg h-full
            overflow-y-scroll no-scrollbar"
            >
                {!singleClassView && searchField}
                {!singleClassView && results}

                {singleClassView && selectedClass}
                {singleClassView && addButtons}
                {singleClassView && favoritesButtons}
                {singleClassView && exitButton}
            </div>
        );
    }
}

export default Search;
