import React from 'react';
import courses from './data/courses.json';
import SearchClass from './SearchClass.js';
import AddButtons from './AddButtons.js';
import Utility from './Utility.js';

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
            return this.searchMessage('Find classes here.', 'Search for a class to add it to your plan.');
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
        for (let course of filtered) {
            courseList.push(
                <SearchClass color={Utility.getCourseColor(course.id)} course={course} key={course.id} select={classData => {
                    this.setState({current: classData});
                }}/>
            )
        }
        if (courseList.length === 0) {
            return this.searchMessage('Absolutely nothing.', `No results for '${search}'. You might want to try searching for something else.`);
        }
        return courseList;

    }

    render() {

        let singleClassView = false;

        let searchField = (
            <div className="sticky top-0 p-2 mb-2 bg-white z-10">
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