import {
    ArrowRightIcon,
    CollectionIcon,
    DotsHorizontalIcon,
    ExternalLinkIcon,
    SearchIcon,
} from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import React from 'react';
import PlanManager from '../../PlanManager';
import ScheduleManager from '../../ScheduleManager';
import {
    SearchResultsElements,
    SearchShortcut,
    UserOptions,
} from '../../types/BaseTypes';
import {
    Course,
    PlanData,
    PlanModificationFunctions,
} from '../../types/PlanTypes';
import {
    ScheduleCourse,
    ScheduleData,
    ScheduleInteractions,
    ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import { Mode, SearchMode } from '../../utility/Constants';
import AddButtons from './AddButtons';
import MiniContentBlock from './MiniContentBlock';
import SearchBrowse from './SearchBrowse';
import SearchButton from './SearchButton';
import SearchClass from './SearchClass';
import SearchScheduleClass from './SearchScheduleClass';

interface SearchProps {
    data: PlanData;
    schedule: ScheduleData;
    switches: UserOptions;
    f: PlanModificationFunctions;
    sf: ScheduleModificationFunctions;
    scheduleInteractions: ScheduleInteractions;
}

interface SearchState {
    search: string;
    mode: SearchMode;
    current?: Course;
    scheduleCurrent?: string;
    shortcut?: SearchShortcut;
}

class Search extends React.Component<SearchProps, SearchState> {
    searchFieldRef: React.RefObject<HTMLInputElement>;

    constructor(props: SearchProps) {
        super(props);

        this.state = { search: '', mode: SearchMode.NORMAL };
        this.searchFieldRef = React.createRef();
    }

    searchMessage(title: string, subtitle: string) {
        return (
            <div
                className="text-center text-gray-600 dark:text-gray-400 px-4"
                key="search-message"
            >
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm font-light">{subtitle}</p>
            </div>
        );
    }

    getResults(): SearchResultsElements {
        const query = this.state.search;
        const mode = this.props.switches.get.mode;

        if (query.length === 0) {
            return {
                results:
                    mode === Mode.PLAN
                        ? [
                              <div key="no-query">
                                  <MiniContentBlock
                                      icon={SearchIcon}
                                      title="Search"
                                  >
                                      Use the search bar to search across every
                                      course at Northwestern and view detailed
                                      information for each one.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={ArrowRightIcon}
                                      title="Drag"
                                  >
                                      Drag courses from this search area into
                                      the quarter you want. Alternatively, you
                                      can click on the course and select the
                                      quarter you want to add it to.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={CollectionIcon}
                                      title="Save"
                                  >
                                      Easily create an account to save multiple
                                      plans and access them from anywhere.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={ExternalLinkIcon}
                                      title="Share"
                                  >
                                      The URL updates as you modify your plan.
                                      Share it with others and they'll have a
                                      copy that they can view and edit.
                                  </MiniContentBlock>
                              </div>,
                          ]
                        : [
                              <div key="no-query">
                                  <MiniContentBlock
                                      icon={SearchIcon}
                                      title="Search"
                                  >
                                      Use the search bar to search across every
                                      course offered{' '}
                                      <span className="font-bold">
                                          {
                                              process.env
                                                  .REACT_APP_SCHEDULE_QUARTER
                                          }
                                      </span>{' '}
                                      at Northwestern and view detailed
                                      information for each one. Search courses
                                      by subject and number, title, time slot,
                                      instructor, or location.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={ArrowRightIcon}
                                      title="Add"
                                  >
                                      Add any of the sections for a course to
                                      your schedule and watch as they appear at
                                      the appropriate time.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={CollectionIcon}
                                      title="Save"
                                  >
                                      Easily create an account to save multiple
                                      schedules and access them from anywhere.
                                      You can even add custom blocks to your
                                      account schedules.
                                  </MiniContentBlock>
                                  <MiniContentBlock
                                      icon={ExternalLinkIcon}
                                      title="Share"
                                  >
                                      The URL updates as you modify your
                                      schedule. Share it with others and they'll
                                      have a copy that they can view and edit.
                                      You can also export your schedule as an
                                      image or to your calendar app.
                                  </MiniContentBlock>
                              </div>,
                          ],
            };
        }

        let results =
            mode === Mode.PLAN
                ? PlanManager.search(query)
                : ScheduleManager.search(query);
        if (results === 'too_short') {
            return {
                results: [
                    this.searchMessage(
                        'Keep typing...',
                        `You'll need at least 3 characters.`
                    ),
                ],
            };
        }

        if (results === 'no_results') {
            return {
                results: [
                    this.searchMessage(
                        'Aw, no results.',
                        `Try refining your search.`
                    ),
                ],
            };
        }

        let courseList = [];
        if (mode === Mode.PLAN) {
            for (let course of results.results as Course[]) {
                courseList.push(
                    <SearchClass
                        course={course}
                        color={PlanManager.getCourseColor(course.id)}
                        select={(course) => {
                            this.setState({ current: course });
                        }}
                        bookmarks={this.props.data.bookmarks}
                        f={this.props.f}
                        key={course.id}
                    />
                );
            }
        } else {
            for (let course of results.results as ScheduleCourse[]) {
                courseList.push(
                    <SearchScheduleClass
                        course={course}
                        color={ScheduleManager.getCourseColor(course.subject)}
                        selected={
                            this.state.scheduleCurrent === course.course_id
                        }
                        select={() => {
                            this.setState({
                                scheduleCurrent:
                                    this.state.scheduleCurrent ===
                                    course.course_id
                                        ? undefined
                                        : course.course_id,
                            });
                        }}
                        interactions={this.props.scheduleInteractions}
                        schedule={this.props.schedule}
                        sf={this.props.sf}
                        key={`search-${course.course_id}`}
                    />
                );
            }
        }

        if (results.limitExceeded) {
            courseList.push(
                <MiniContentBlock
                    icon={DotsHorizontalIcon}
                    title={`and ${results.limitExceeded} more.`}
                    key="too-many"
                >
                    There are too many results to display. You'll need to narrow
                    your search to get more.
                </MiniContentBlock>
            );
        }

        return {
            results: courseList,
            shortcut: results.shortcut,
        };
    }

    render() {
        let search = this.state.search;

        let { results, shortcut } = this.getResults();

        let current = this.state.current;
        let bookmarks = this.props.data.bookmarks;

        const queryEmpty = search.length === 0;
        const mode = this.state.mode;

        return (
            <div
                className={`${
                    this.props.switches.get.tab === 'Search' ? '' : 'hidden '
                }border-4 border-gray-400 dark:border-gray-500 my-2 rounded-lg shadow-lg h-full
                overflow-y-scroll no-scrollbar`}
            >
                {!current && (
                    <>
                        <div className="sticky top-0 p-2 mb-2 bg-white dark:bg-gray-800 z-10 rounded-lg">
                            <div className="block mt-4 mb-2 mx-auto w-11/12 relative">
                                <input
                                    className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-md
                            rounded-lg outline-none hover:border-gray-500 active:border-black dark:hover:border-gray-400 dark:active:border-white text-lg p-2 px-4
                            transition-all duration-150 text-black dark:text-white"
                                    ref={this.searchFieldRef}
                                    value={search}
                                    placeholder="Search for classes..."
                                    onChange={(event) => {
                                        this.setState({
                                            scheduleCurrent: undefined,
                                            search: event.target.value,
                                        });
                                    }}
                                />
                                {!queryEmpty && (
                                    <button
                                        className="block absolute right-4 top-0 bottom-0 my-2 text-gray-300 hover:text-red-400 active:text-red-300 
                            dark:text-gray-600 dark:hover:text-red-400 dark:active:text-red-500 transition-colors duration-150"
                                        onClick={() => {
                                            this.setState({ search: '' });
                                            this.searchFieldRef.current?.focus();
                                        }}
                                    >
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
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
                            {queryEmpty && (
                                <div className="flex justify-center gap-4 m-4">
                                    <SearchButton
                                        active={
                                            mode === SearchMode.BROWSE
                                                ? 'blue'
                                                : undefined
                                        }
                                        action={() =>
                                            this.setState({
                                                mode:
                                                    mode === SearchMode.BROWSE
                                                        ? SearchMode.NORMAL
                                                        : SearchMode.BROWSE,
                                            })
                                        }
                                    >
                                        Browse
                                    </SearchButton>
                                    <SearchButton
                                        active={
                                            mode === SearchMode.ADVANCED
                                                ? 'orange'
                                                : undefined
                                        }
                                        action={() =>
                                            this.setState({
                                                mode:
                                                    mode === SearchMode.ADVANCED
                                                        ? SearchMode.NORMAL
                                                        : SearchMode.ADVANCED,
                                            })
                                        }
                                    >
                                        Advanced
                                    </SearchButton>
                                </div>
                            )}
                        </div>
                        {queryEmpty &&
                            this.state.mode === SearchMode.BROWSE && (
                                <SearchBrowse />
                            )}
                        {results}
                    </>
                )}

                {current && (
                    <>
                        <SearchClass
                            course={current}
                            color={PlanManager.getCourseColor(current.id)}
                        />
                        <AddButtons
                            action={(year, quarter) => {
                                if (current) {
                                    this.props.f.addCourse(current, {
                                        year,
                                        quarter,
                                    });
                                    this.setState({ current: undefined });
                                }
                            }}
                            courses={this.props.data.courses}
                        />
                        <div className="py-2">
                            <p className="text-center text-gray-500 font-bold p-2 text-sm">
                                MY LIST
                            </p>
                            <button
                                className="block mx-auto bg-indigo-500 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                                onClick={() => {
                                    if (!current) return;
                                    if (bookmarks.noCredit.has(current)) {
                                        this.props.f.removeBookmark(
                                            current,
                                            false
                                        );
                                    } else {
                                        this.props.f.addBookmark(
                                            current,
                                            false
                                        );
                                    }
                                }}
                            >
                                {bookmarks.noCredit.has(current)
                                    ? 'Remove from bookmarks'
                                    : 'Add to bookmarks'}
                            </button>
                            <button
                                className="block mx-auto bg-indigo-800 dark:bg-indigo-400 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                                onClick={() => {
                                    if (!current) return;
                                    if (bookmarks.forCredit.has(current)) {
                                        this.props.f.removeBookmark(
                                            current,
                                            true
                                        );
                                    } else {
                                        this.props.f.addBookmark(current, true);
                                    }
                                }}
                            >
                                {bookmarks.forCredit.has(current)
                                    ? 'Remove for credit'
                                    : 'Add for credit'}
                            </button>
                        </div>
                    </>
                )}

                {current && (
                    <button
                        className="block mx-auto my-8 bg-gray-500 text-white font-medium
                        w-4/5 p-2 opacity-100 hover:opacity-60 transition-all duration-150 rounded-md shadow-sm"
                        onClick={() => {
                            this.setState({ current: undefined });
                        }}
                    >
                        Back
                    </button>
                )}
            </div>
        );
    }
}

export default Search;
