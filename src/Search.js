import React from 'react';
import courses from './data/courses.json';
import SearchClass from './SearchClass.js';
import AddButtons from './AddButtons.js';
import Utility from './Utility.js';
import { SearchIcon, BookOpenIcon, ArrowRightIcon, SaveIcon, DotsHorizontalIcon } from '@heroicons/react/outline';

const SEARCH_RESULT_LIMIT = 100;

function MiniContentBlock(props) {

    return (
        <div className="text-center py-4">
            <div className="mx-auto my-1 flex items-center justify-center text-gray-500">
                {props.icon}
            </div>
            <p className="text-lg font-medium text-gray-500">
                {props.title}
            </p>
            <p className="text-sm font-light text-gray-400">
                {props.text}
            </p>
        </div>
    )

}

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            current: null
        }

    }

    searchMessage(title, subtitle) {
        return (
            <div className="text-center text-gray-600 px-4">
                <p className="text-lg font-medium">
                    {title}
                </p>
                <p className="text-sm font-light">
                    {subtitle}
                </p>
            </div>
        )
    }

    getResults() {

        let search = this.state.search.toLowerCase();
        if (search.length === 0) {
            return (
                <div className="px-4">
                    <MiniContentBlock
                        icon={<SearchIcon className="w-6 h-6"/>}
                        title="Search"
                        text="Use the search bar to search across every undergraduate course at Northwestern."
                    />
                    <MiniContentBlock
                        icon={<BookOpenIcon className="w-6 h-6"/>}
                        title="Learn"
                        text="Get information like the course description, prerequisites, and more, all from right here. We'll help you make sure prereqs are met when you're adding courses, too."
                    />
                    <MiniContentBlock
                        icon={<ArrowRightIcon className="w-6 h-6"/>}
                        title="Drag"
                        text="Drag courses from this search area into the quarter you want. Alternatively, you can click on the course and select the quarter you want to add it to."
                    />
                    <MiniContentBlock
                        icon={<SaveIcon className="w-6 h-6"/>}
                        title="Save and share"
                        text="The URL updates as you modify your plan. Save it somewhere or share it with others."
                    />

                </div>
            )
        }
        if (search.length < 3) {
            return this.searchMessage('Keep typing...', `You'll need at least 3 characters.`);
        }

        let filtered = courses.courses.filter(course => {
            if (course.id.toLowerCase().includes(search)) return true;
            if (course.name.toLowerCase().includes(search)) return true;
            if (course.id.toLowerCase().replace('_', ' ').includes(search)) return true;
            return false;
        });

        let courseList = [];
        let count = 0;
        for (let course of filtered) {
            courseList.push(
                <SearchClass color={Utility.getCourseColor(course.id)} course={course} key={course.id} select={classData => {
                    this.setState({current: classData});
                }}/>
            )
            count++;
            if (count >= SEARCH_RESULT_LIMIT) {
                courseList.push(
                    <MiniContentBlock
                        icon={<DotsHorizontalIcon className="w-6 h-6"/>}
                        title={`and ${filtered.length - count} more.`}
                        text="There are too many results to display. You'll need to narrow your search to get more."
                        key="too-many"/>
                )
                break;
            }
        }
        if (courseList.length === 0) {
            return this.searchMessage('Aw, no results.', `Try refining your search.`);
        }

        return courseList;

    }

    render() {

        let singleClassView = false;

        let searchField = (
            <div className="sticky top-0 p-2 mb-2 bg-white z-10 rounded-lg">
                <input className="block m-4 mx-auto w-11/12 border-2 border-gray-300 shadow-md
                rounded-lg hover:border-gray-500 outline-none focus:border-black text-lg p-2 px-4
                bg-white" value={this.state.search} placeholder="Search for classes..." onChange={event => {
                    this.setState({search: event.target.value})
                }}/>
            </div>
        )
        
        let selectedClass = null;
        let addButtons = null;
        let exitButton = null;

        if (this.state.current) {
            singleClassView = true;

            selectedClass = (
                <SearchClass color={Utility.getCourseColor(this.state.current.id)} course={this.state.current}/>
            )

            addButtons = (
                    <AddButtons action={(year, quarter) => {
                        this.props.addCourse(this.state.current, year, quarter);
                        this.setState({current: null});
                    }} data={this.props.data}/>
            )
            exitButton = (
                <button className="block mx-auto bg-white border-2 border-gray-400 text-gray-400
                w-2/3 p-2 my-4 hover:border-black hover:text-black transition-all duration-150 rounded-md" onClick={() => {
                    this.setState({current: null});
                }}>
                    Back
                </button>
            );
        }


        return (
            <div className="border-4 border-black my-4 rounded-xl shadow-lg h-full
            overflow-scroll overscroll-contain">
                {!singleClassView && searchField}
                {!singleClassView && this.getResults()}

                {singleClassView && selectedClass}
                {singleClassView && addButtons}
                {singleClassView && exitButton}

            </div>
        )
    }

}

export default Search;