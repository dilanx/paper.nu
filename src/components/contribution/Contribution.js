import React from 'react';
import ContributionCourse from './ContributionCourse.js';

class Contribution extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            shown: 1
        }
    }

    dragCourse(course, index) {
        let courses = this.state.courses;
        courses[index] = course;
        this.setState({courses: courses});
    }

    removeCourse(index, isEmpty) {
        if (!isEmpty) {
            let courses = this.state.courses;
            courses.splice(index, 1);
            this.setState({courses: courses});
        }
        this.setState({shown: this.state.shown - 1});
    }

    render() {

        let cc = [];
        let s = 0;

        let multiple = this.state.shown > 1;

        for (let i = 0; i < this.state.courses.length; i++) {
            cc.push(
                <ContributionCourse
                    course={this.state.courses[i]}
                    alert={this.props.alert}
                    index={i}
                    multiple={multiple}
                    dragCourse={(course, index) => this.dragCourse(course, index)}
                    removeCourse={index => this.removeCourse(index, false)}
                    key={`cc-${i}`}/>
            )
            s++;
        }

        for (; s < this.state.shown; s++) {
            cc.push(
                <ContributionCourse
                    alert={this.props.alert}
                    index={s}
                    multiple={multiple}
                    dragCourse={(course, index) => this.dragCourse(course, index)}
                    removeCourse={index => this.removeCourse(index, true)}
                    key={`cc-${s}`}/>
            )
        }

        return (
            <div className="relative p-4 border-4 border-red-400 rounded-lg m-5 shadow-sm bg-white dark:bg-gray-800">
                <p className="text-center text-2xl text-red-400 font-bold pb-2">
                    CONTRIBUTION
                </p>

                <p className="text-center text-sm text-gray-600 py-2 lg:px-24 dark:text-gray-300">
                    There's a lot of data that would be useful to have here. While a lot of the main course data was grabbed in bulk from the Northwestern course catalog site,
                    there's still a lot missing, like which courses are offered during what quarters, prerequisites for every course, which courses fulfill specific major requirements,
                    and more. A lot of that is department/major specific, and is spread out over several websites that may only have data for the current year, or might not even have
                    been updated in the last few years. The current course data file is around 22000 lines, and updating that manually doesn't sound fun.
                </p>

                <p className="text-center text-sm text-gray-800 py-2 lg:px-40">
                    Instead, you can share what you know about Northwestern courses to improve the data!
                </p>

                <div className="block sm:hidden">
                    <p className="text-center text-md text-red-400 py-2">
                        Sadly, the contribution feature is not available on mobile devices.
                        Revisit on a larger computer to get started contributing data!
                    </p>
                </div>

                <div className="hidden sm:block">

                    <p className="text-center font-md font-medium text-red-500 p-2">
                        Submission unavailable until I finish making this feature.
                    </p>

                    {cc}

                    <button className="block mt-2 mb-4 mx-auto py-2 px-4 bg-orange-400 rounded-lg text-sm font-medium text-white opacity-100 hover:opacity-60 transition-all duration-150 shadow-md"
                            onClick={() => {
                                this.setState({shown: this.state.shown + 1});
                            }}>
                        Add more data
                    </button>

                    <button className="block mt-4 mb-2 mx-auto py-2 px-20 bg-emerald-500 rounded-lg text-md font-medium text-white opacity-60
                        transition-all duration-150 cursor-not-allowed shadow-md">
                        SUBMIT
                    </button>

                    <p className="text-center text-xs text-gray-500 font-bold">
                        You can't submit yet since I haven't finished making this lol
                    </p>

                </div>

            </div>
        )

    }

}

export default Contribution;