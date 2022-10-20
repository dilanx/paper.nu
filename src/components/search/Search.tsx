import {
  ArrowRightIcon,
  ArrowSmallLeftIcon,
  CloudIcon,
  EllipsisHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  XCircleIcon,
  FunnelIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import PlanManager from '../../PlanManager';
import ScheduleManager from '../../ScheduleManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
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
import {
  FilterOptions,
  SearchDefaults,
  SearchFilter,
  SearchResultsElements,
  SearchShortcut,
} from '../../types/SearchTypes';
import { Mode, SearchMode } from '../../utility/Constants';
import { searchFilterForm } from '../../utility/Forms';
import Utility from '../../utility/Utility';
import CampusMinimap from '../map/CampusMinimap';
import AddButtons from './AddButtons';
import MiniContentBlock from './MiniContentBlock';
import SearchBrowse from './SearchBrowse';
import SearchButton from './SearchButton';
import SearchClass from './SearchClass';
import SearchFilterDisplay from './SearchFilterDisplay';
import SearchScheduleClass from './SearchScheduleClass';

interface SearchProps {
  data: PlanData;
  schedule: ScheduleData;
  switches: UserOptions;
  f: PlanModificationFunctions;
  sf: ScheduleModificationFunctions;
  scheduleInteractions: ScheduleInteractions;
  alert: Alert;
  defaults?: SearchDefaults;
  expandMap: () => void;
}

interface SearchState {
  search: string;
  mode: SearchMode;
  filter: SearchFilter;
  current?: Course;
  scheduleCurrent?: string;
  shortcut?: SearchShortcut;
  forceDisplay: boolean;
  browseSchool?: string;
}

class Search extends React.Component<SearchProps, SearchState> {
  searchFieldRef: React.RefObject<HTMLInputElement>;

  constructor(props: SearchProps) {
    super(props);

    this.state = {
      search: props.defaults?.query ?? '',
      mode: SearchMode.NORMAL,
      filter: {
        get: {},
        set: (filter, returnToNormalMode = false) =>
          this.updateFilter(filter, returnToNormalMode),
      },
      scheduleCurrent: props.defaults?.scheduleCurrent,
      forceDisplay: false,
    };
    this.searchFieldRef = React.createRef();
  }

  updateFilter(filter: Partial<FilterOptions>, returnToNormalMode: boolean) {
    const updated = this.state.filter.get;
    for (const x in filter) {
      const f = x as keyof FilterOptions;
      if (!filter[f]) {
        delete updated[f];
        continue;
      }
      updated[f] = filter[f] as any;
    }

    this.setState({
      filter: {
        ...this.state.filter,
        get: updated,
      },
      mode: returnToNormalMode ? SearchMode.NORMAL : this.state.mode,
    });
  }

  removeFilter(filter: keyof FilterOptions) {
    let newFilter = { ...this.state.filter.get };
    delete newFilter[filter];
    this.setState({
      filter: {
        ...this.state.filter,
        get: newFilter,
      },
    });
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

  getResults(
    query: string,
    filter: FilterOptions,
    appMode: Mode,
    searchMode: SearchMode
  ): SearchResultsElements {
    if (searchMode !== SearchMode.NORMAL) {
      return {};
    }

    let results =
      appMode === Mode.PLAN
        ? PlanManager.search(query)
        : ScheduleManager.search(query, filter);

    if (results === 'no_query') {
      return {
        placeholder:
          appMode === Mode.PLAN
            ? [
                <div key="no-query">
                  <MiniContentBlock icon={MagnifyingGlassIcon} title="Search">
                    Use the search bar to search across every course at
                    Northwestern and view detailed information for each one.
                  </MiniContentBlock>
                  <MiniContentBlock icon={ArrowRightIcon} title="Drag">
                    Drag courses from this search area into the quarter you
                    want. Alternatively, you can click on the course and select
                    the quarter you want to add it to.
                  </MiniContentBlock>
                  <MiniContentBlock icon={CloudIcon} title="Save">
                    Easily create an account to save multiple plans and access
                    them from anywhere.
                  </MiniContentBlock>
                  <MiniContentBlock
                    icon={ArrowTopRightOnSquareIcon}
                    title="Share"
                  >
                    The URL updates as you modify your plan. Share it with
                    others and they'll have a copy that they can view and edit.
                  </MiniContentBlock>
                </div>,
              ]
            : [
                <div key="no-query">
                  <MiniContentBlock icon={MagnifyingGlassIcon} title="Search">
                    Use the search bar to search across every course offered{' '}
                    <span className="font-bold">
                      {process.env.REACT_APP_SCHEDULE_QUARTER}
                    </span>{' '}
                    at Northwestern and view detailed information for each one.
                    Search courses by subject and number, title, time slot,
                    instructor, or location.
                  </MiniContentBlock>
                  <MiniContentBlock icon={ArrowRightIcon} title="Add">
                    Add any of the sections for a course to your schedule and
                    watch as they appear at the appropriate time.
                  </MiniContentBlock>
                  <MiniContentBlock icon={CloudIcon} title="Save">
                    Easily create an account to save multiple schedules and
                    access them from anywhere. You can even add custom blocks to
                    your account schedules.
                  </MiniContentBlock>
                  <MiniContentBlock
                    icon={ArrowTopRightOnSquareIcon}
                    title="Share"
                  >
                    The URL updates as you modify your schedule. Share it with
                    others and they'll have a copy that they can view and edit.
                    You can also export your schedule as an image or to your
                    calendar app.
                  </MiniContentBlock>
                </div>,
              ],
      };
    }

    if (results === 'too_short') {
      return {
        placeholder: [
          this.searchMessage(
            'Keep typing...',
            `You'll need at least 3 characters.`
          ),
        ],
      };
    }

    if (results === 'no_results') {
      return {
        placeholder: [
          this.searchMessage('Aw, no results.', `Try refining your search.`),
        ],
      };
    }

    if (results === 'not_loaded') {
      return {
        placeholder: [
          this.searchMessage(
            'Data unavailable.',
            'It looks like the course data failed to load. Try refreshing the page.'
          ),
        ],
      };
    }

    let courseList = [];
    if (appMode === Mode.PLAN) {
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
            selected={this.state.scheduleCurrent === course.course_id}
            select={() => {
              this.setState({
                scheduleCurrent:
                  this.state.scheduleCurrent === course.course_id
                    ? undefined
                    : course.course_id,
              });
            }}
            interactions={this.props.scheduleInteractions}
            schedule={this.props.schedule}
            sf={this.props.sf}
            filter={filter}
            key={`search-${course.course_id}`}
          />
        );
      }
    }

    if (results.limitExceeded) {
      courseList.push(
        <MiniContentBlock
          icon={EllipsisHorizontalIcon}
          title={`and ${results.limitExceeded} more.`}
          key="too-many"
        >
          There are too many results to display. You'll need to narrow your
          search to get more.
        </MiniContentBlock>
      );
    }

    return {
      results: courseList,
      shortcut: results.shortcut,
    };
  }

  componentDidUpdate(prevProps: Readonly<SearchProps>) {
    if (prevProps.defaults?.updated !== this.props.defaults?.updated) {
      this.setState({
        search: this.props.defaults?.query ?? '',
        scheduleCurrent: this.props.defaults?.scheduleCurrent,
      });
    }
  }

  render() {
    const search = this.state.search;
    const appMode = this.props.switches.get.mode as Mode;
    const searchMode = this.state.mode;
    const filter = this.state.filter;

    let { results, placeholder, shortcut } = this.getResults(
      search,
      filter.get,
      appMode,
      searchMode
    );

    let current = this.state.current;
    let bookmarks = this.props.data.bookmarks;

    const queryEmpty = search.length === 0;

    return (
      <div
        className={`${
          this.props.switches.get.tab === 'Search' ? '' : 'hidden '
        }border-4 border-gray-400 dark:border-gray-500 my-2 rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden`}
      >
        {!current && (
          <>
            <div className="p-2 mb-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="block mt-4 mb-2 mx-auto w-11/12 relative">
                <input
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-sm
                    rounded-lg outline-none hover:border-gray-500 focus:border-black dark:hover:border-gray-400 dark:focus:border-white text-lg p-2 px-4
                    transition-all duration-150 text-black dark:text-white"
                  ref={this.searchFieldRef}
                  value={search}
                  placeholder={`Search ${
                    appMode === Mode.PLAN
                      ? 'for classes...'
                      : process.env.REACT_APP_SCHEDULE_QUARTER + '...'
                  }`}
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
                <p className="text-center text-sm m-1 p-0 text-gray-500 dark:text-gray-400">
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
              {Object.keys(filter.get).length > 0 && (
                <SearchFilterDisplay filter={filter} />
              )}
              {queryEmpty && appMode === Mode.SCHEDULE && (
                <div className="flex justify-center gap-2 m-4">
                  <SearchButton
                    active={
                      searchMode === SearchMode.BROWSE ? 'green' : undefined
                    }
                    action={() => {
                      if (searchMode !== SearchMode.BROWSE) {
                        this.setState({
                          mode: SearchMode.BROWSE,
                          browseSchool: undefined,
                        });
                        return;
                      }
                      if (this.state.browseSchool) {
                        this.setState({
                          browseSchool: undefined,
                        });
                        return;
                      }

                      this.setState({
                        mode: SearchMode.NORMAL,
                      });
                    }}
                  >
                    {searchMode === SearchMode.BROWSE &&
                    this.state.browseSchool ? (
                      <div className="flex w-full justify-center items-center gap-1">
                        <ArrowSmallLeftIcon className="w-5 h-5" /> Back
                      </div>
                    ) : (
                      'Browse'
                    )}
                  </SearchButton>
                  <SearchButton
                    action={() => {
                      this.props.alert({
                        title: 'Edit search filters',
                        icon: FunnelIcon,
                        message:
                          'Filter search results by any combination of the properties below.',
                        form: {
                          sections: searchFilterForm(filter.get),
                          onSubmit: ({
                            subject,
                            startAfter,
                            startBefore,
                            endAfter,
                            endBefore,
                            meetingDays,
                            components,
                            instructor,
                            location,
                          }) => {
                            filter.set({
                              subject: Utility.safe(subject)?.toUpperCase(),
                              startAfter: Utility.parseTime(startAfter),
                              startBefore: Utility.parseTime(startBefore),
                              endAfter: Utility.parseTime(endAfter),
                              endBefore: Utility.parseTime(endBefore),
                              meetingDays: Utility.safeArray(
                                meetingDays ? meetingDays.split(',') : []
                              ),
                              components: Utility.safeArray(
                                components ? components.split(',') : []
                              ),
                              instructor:
                                Utility.safe(instructor)?.toLowerCase(),
                              location: Utility.safe(location)?.toLowerCase(),
                            });
                          },
                        },
                        confirmButton: 'Apply',
                        confirmButtonColor: 'orange',
                        iconColor: 'orange',
                        cancelButton: 'Cancel',
                      });
                    }}
                    tooltip="Edit filter"
                  >
                    <FunnelIcon className="w-5 h-5" />
                  </SearchButton>
                  <SearchButton action={() => {}} tooltip="Change term">
                    <CalendarDaysIcon className="w-5 h-5" />
                  </SearchButton>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden overflow-y-scroll no-scrollbar">
              {queryEmpty && !results && searchMode === SearchMode.BROWSE && (
                <SearchBrowse
                  filter={this.state.filter}
                  school={this.state.browseSchool}
                  setSchool={(school) => {
                    this.setState({ browseSchool: school });
                  }}
                />
              )}
              {placeholder}
              {results}
            </div>
            {this.props.switches.get.minimap && (
              <div className="mt-2 h-[25vh] bg-white dark:bg-gray-800 rounded-lg">
                <CampusMinimap
                  expand={this.props.expandMap}
                  section={
                    this.props.scheduleInteractions.previewSection.get ||
                    this.props.schedule.schedule[
                      this.props.scheduleInteractions.hoverSection.get || ''
                    ]
                  }
                />
              </div>
            )}
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
                className="block mx-auto bg-indigo-500 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60 rounded-md shadow-sm"
                onClick={() => {
                  if (!current) return;
                  if (bookmarks.noCredit.has(current)) {
                    this.props.f.removeBookmark(current, false);
                  } else {
                    this.props.f.addBookmark(current, false);
                  }
                }}
              >
                {bookmarks.noCredit.has(current)
                  ? 'Remove from bookmarks'
                  : 'Add to bookmarks'}
              </button>
              <button
                className="block mx-auto bg-indigo-800 dark:bg-indigo-400 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60 rounded-md shadow-sm"
                onClick={() => {
                  if (!current) return;
                  if (bookmarks.forCredit.has(current)) {
                    this.props.f.removeBookmark(current, true);
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
                        w-4/5 p-2 opacity-100 hover:opacity-60 rounded-md shadow-sm"
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
