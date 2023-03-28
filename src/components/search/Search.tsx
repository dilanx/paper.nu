import {
  ArrowRightIcon,
  ArrowSmallLeftIcon,
  ArrowTopRightOnSquareIcon,
  CloudIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  CalendarDaysIcon,
  FunnelIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { getTerms } from '../../DataManager';
import PlanManager from '../../PlanManager';
import ScheduleManager from '../../ScheduleManager';
import { Alert, AlertData } from '../../types/AlertTypes';
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
  ScheduleSection,
  TermInfo,
} from '../../types/ScheduleTypes';
import {
  FilterOptions,
  SearchDefaults,
  SearchFilter,
  SearchResultsElements,
  SearchShortcut,
} from '../../types/SearchTypes';
import { SideCard } from '../../types/SideCardTypes';
import { Mode, SearchMode } from '../../utility/Constants';
import {
  planSearchFilterForm,
  scheduleSearchFilterForm,
} from '../../utility/Forms';
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
  sideCard: SideCard;
  alert: Alert;
  defaults?: SearchDefaults;
  expandMap: () => void;
  loading?: boolean;
  term?: TermInfo;
  switchTerm: (termId: string) => void;
  latestTermId?: string;
}

interface SearchState {
  search: string;
  mode: SearchMode;
  filter: SearchFilter;
  planCurrent?: string;
  scheduleCurrent?: string;
  shortcut?: SearchShortcut;
  forceDisplay: boolean;
  browseSchool?: string;
}

export function switchTermAlert(
  switchTerm: (termId: string) => void,
  currentTermId?: string
): AlertData {
  return {
    title: 'Change term',
    icon: CalendarDaysIcon,
    message:
      'Switching terms will allow you to create a schedule for a different quarter. This will clear everything on your current schedule.',
    color: 'violet',
    selectMenu: {
      options:
        getTerms()?.sort((a, b) => parseInt(b.value) - parseInt(a.value)) || [],
      defaultValue: currentTermId,
    },
    confirmButton: 'Change',
    cancelButton: 'Cancel',
    action: ({ inputText: termId }) => {
      if (termId) {
        switchTerm(termId);
      }
    },
  };
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
        className="px-4 text-center text-gray-600 dark:text-gray-400"
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
    let results =
      appMode === Mode.PLAN
        ? PlanManager.search(query, filter)
        : ScheduleManager.search(query, filter);

    if (results === 'no_query') {
      if (searchMode !== SearchMode.NORMAL) {
        return {};
      }
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
                    <span className="font-bold">{this.props.term?.name}</span>{' '}
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
            courses={this.props.data.courses}
            course={course}
            color={PlanManager.getCourseColor(course.id)}
            select={(courseId) => {
              this.setState({
                planCurrent:
                  this.state.planCurrent === courseId ? undefined : courseId,
              });
            }}
            selected={this.state.planCurrent === course.id}
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
            sideCard={this.props.sideCard}
            alert={this.props.alert}
            key={`search-${course.course_id}-${course.subject}-${course.number}`}
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
    const darkMode = this.props.switches.get.dark;

    let { results, placeholder, shortcut } = this.getResults(
      search,
      filter.get,
      appMode,
      searchMode
    );

    let bookmarks = this.props.data.bookmarks;

    const queryEmpty = search.length === 0;

    const loading = this.props.loading || !this.props.term;
    const newerTermAvailable =
      this.props.latestTermId !== undefined &&
      this.props.latestTermId !== this.props.term?.id;

    const mapSection: ScheduleSection =
      this.props.scheduleInteractions.previewSection.get ||
      this.props.schedule.schedule[
        this.props.scheduleInteractions.hoverSection.get || ''
      ];

    const roomFinderAvailable = mapSection?.room?.some((r) =>
      r?.toLowerCase().includes('tech')
    );

    return (
      <div
        className={`${
          this.props.switches.get.tab === 'Search' ? '' : 'hidden '
        }border-4 my-2 flex flex-1 flex-col overflow-hidden rounded-2xl border-gray-400 shadow-lg dark:border-gray-500 ${
          loading ? 'items-center justify-center' : ''
        }`}
      >
        {loading ? (
          <SpinnerCircularFixed
            size={64}
            thickness={160}
            speed={200}
            color={darkMode ? 'rgb(212, 212, 212)' : 'rgb(115, 115, 115)'}
            secondaryColor={
              darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'
            }
          />
        ) : (
          <>
            <div className="mb-2 rounded-lg bg-white p-2 dark:bg-gray-800">
              <div className="relative mx-auto mt-4 mb-2 block w-11/12">
                <input
                  className="w-full rounded-lg border-2 border-gray-300 bg-white p-2 px-4
                    text-lg text-black shadow-sm outline-none transition-all duration-150 hover:border-gray-500 focus:border-black dark:border-gray-700
                    dark:bg-gray-800 dark:text-white dark:hover:border-gray-400 dark:focus:border-white"
                  ref={this.searchFieldRef}
                  value={search}
                  placeholder={`Search ${
                    appMode === Mode.PLAN
                      ? 'for classes...'
                      : this.props.term?.name + '...'
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
                    className="absolute right-4 top-0 bottom-0 my-2 block text-gray-300 transition-colors duration-150 
                                            hover:text-red-400 active:text-red-300 dark:text-gray-600 dark:hover:text-red-400 dark:active:text-red-500"
                    onClick={() => {
                      this.setState({ search: '' });
                      this.searchFieldRef.current?.focus();
                    }}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {shortcut && (
                <p className="m-1 p-0 text-center text-xs text-gray-500 dark:text-gray-400">
                  replacing{' '}
                  <span className="font-medium text-black dark:text-white">
                    {shortcut.replacing}
                  </span>{' '}
                  with{' '}
                  <span className="font-medium text-black dark:text-white">
                    {shortcut.with}
                  </span>
                </p>
              )}
              {Object.keys(filter.get).length > 0 && (
                <SearchFilterDisplay filter={filter} appMode={appMode} />
              )}
              {queryEmpty && (
                <div className="m-4 flex justify-center gap-2">
                  <SearchButton
                    active={
                      searchMode === SearchMode.BROWSE || filter.get.subject
                        ? 'green'
                        : undefined
                    }
                    action={() => {
                      if (filter.get.subject) {
                        const subj = filter.get.subject;
                        filter.set({ subject: undefined });
                        this.setState({
                          mode: SearchMode.BROWSE,
                          browseSchool:
                            ScheduleManager.getSchoolOfSubject(subj),
                        });
                        return;
                      }
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
                    {(searchMode === SearchMode.BROWSE &&
                      this.state.browseSchool) ||
                    filter.get.subject ? (
                      <div className="flex w-full items-center justify-center gap-1">
                        <ArrowSmallLeftIcon className="h-5 w-5" /> Back
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
                        message: `Filter search results for ${
                          appMode === Mode.PLAN ? 'plan' : 'schedule'
                        } data by any combination of the properties below.`,
                        form: {
                          sections:
                            appMode === Mode.PLAN
                              ? planSearchFilterForm(filter.get)
                              : scheduleSearchFilterForm(filter.get),
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
                            distros,
                            unitGeq,
                            unitLeq,
                            include,
                          }) => {
                            filter.set({
                              subject: Utility.safe(subject)?.toUpperCase(),
                              startAfter: Utility.parseTime(startAfter),
                              startBefore: Utility.parseTime(startBefore),
                              endAfter: Utility.parseTime(endAfter),
                              endBefore: Utility.parseTime(endBefore),
                              meetingDays:
                                Utility.safeArrayCommaSplit(meetingDays),
                              components:
                                Utility.safeArrayCommaSplit(components),
                              instructor:
                                Utility.safe(instructor)?.toLowerCase(),
                              location: Utility.safe(location)?.toLowerCase(),
                              distros: Utility.safeArrayCommaSplit(distros),
                              unitGeq: Utility.safeNumber(unitGeq),
                              unitLeq: Utility.safeNumber(unitLeq),
                              include: Utility.safeArrayCommaSplit(include),
                            });
                          },
                        },
                        confirmButton: 'Apply',
                        color: 'orange',
                        cancelButton: 'Cancel',
                      });
                    }}
                  >
                    Filter
                  </SearchButton>
                  {appMode === Mode.SCHEDULE && (
                    <SearchButton
                      action={() => {
                        this.props.alert(
                          switchTermAlert(
                            this.props.switchTerm,
                            this.props.term?.id
                          )
                        );
                      }}
                      tooltip="Change term"
                      ring={newerTermAvailable}
                    >
                      <CalendarDaysIcon className="h-5 w-5" />
                    </SearchButton>
                  )}
                </div>
              )}
              {newerTermAvailable &&
                appMode === Mode.SCHEDULE &&
                queryEmpty && (
                  <p className="text-center text-xs font-medium text-violet-600 dark:text-violet-400">
                    COURSES FOR A NEWER TERM ARE AVAILABLE
                  </p>
                )}
            </div>
            <div className="no-scrollbar flex-1 overflow-hidden overflow-y-scroll">
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
            {appMode === Mode.SCHEDULE && this.props.switches.get.minimap && (
              <div className="relative mt-2 hidden h-[25vh] rounded-lg bg-white dark:bg-gray-800 hsm:block">
                <CampusMinimap
                  expand={this.props.expandMap}
                  location={this.props.scheduleInteractions.hoverLocation.get}
                  section={mapSection}
                />

                <AnimatePresence>
                  {roomFinderAvailable && (
                    <motion.div
                      initial={{ x: '-50%', y: 100 }}
                      animate={{ y: 0 }}
                      exit={{ y: 100 }}
                      transition={{ delay: 0.25, duration: 0.2 }}
                      className="absolute bottom-1 left-1/2 z-20 w-full -translate-x-1/2 px-2"
                    >
                      <p className="rounded-lg bg-gray-400 px-1 py-0.5 text-center text-xs font-medium text-white dark:bg-gray-500">
                        ROOM FINDER AVAILABLE FROM COURSE INFO MENU
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Search;
