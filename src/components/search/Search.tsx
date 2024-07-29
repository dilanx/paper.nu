import { useApp, useData } from '@/app/Context';
import { getOrganizedTerms, getTermName } from '@/app/Data';
import { getCourseColor, getSchoolOfSubject } from '@/app/Plan';
import { filterExists, searchPlan, searchSchedule } from '@/app/Search';
import CampusMinimap from '@/components/map/CampusMinimap';
import ChangeTerm from '@/components/menu/ChangeTerm';
import { AlertData } from '@/types/AlertTypes';
import { Course } from '@/types/PlanTypes';
import {
  ScheduleCourse,
  ScheduleInteractions,
  ScheduleSection,
  TermInfo,
} from '@/types/ScheduleTypes';
import {
  DisplayableSearchResults,
  FilterOptions,
  SearchDefaults,
} from '@/types/SearchTypes';
import { Mode, SearchMode } from '@/utility/Constants';
import {
  planSearchFilterForm,
  scheduleSearchFilterForm,
} from '@/utility/Forms';
import {
  getTermColor,
  parseTime,
  safe,
  safeArrayCommaSplit,
  safeNumber,
} from '@/utility/Utility';
import {
  ArrowSmallLeftIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  CalendarDaysIcon,
  FunnelIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useCallback, useMemo, useRef, useState } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import MiniContentBlock from './MiniContentBlock';
import SearchBrowse from './SearchBrowse';
import SearchButton from './SearchButton';
import SearchClass from './SearchClass';
import SearchFilterDisplay from './SearchFilterDisplay';
import SearchMessage from './SearchMessage';
import SearchPlanPlaceholder from './SearchPlanPlaceholder';
import SearchScheduleClass from './SearchScheduleClass';
import SearchSchedulePlaceholder from './SearchSchedulePlaceholder';

export function switchTermAlert(
  switchTerm: (termId: string) => void,
  currentTermId?: string
): AlertData {
  const terms = getOrganizedTerms();
  const [year, quarter] =
    (currentTermId && getTermName(currentTermId)?.split(' ')) || [];

  return {
    title: 'Change term',
    icon: CalendarDaysIcon,
    message:
      'Switching terms will allow you to create a schedule for a different quarter. This will clear everything on your current schedule.',
    color: 'violet',
    textHTML: !terms ? (
      <span className="text-red-500">
        Something went wrong when trying to load terms.
      </span>
    ) : undefined,
    custom: terms
      ? {
          content: (context, setContext) => (
            <ChangeTerm
              terms={terms}
              context={context}
              setContext={setContext}
            />
          ),
          initialContext: {
            year,
            quarter,
          },
        }
      : undefined,
    confirmButton: 'Change',
    cancelButton: 'Cancel',
    action: ({ context }) => {
      const termId = terms?.[context.year][context.quarter];
      if (termId) {
        switchTerm(termId);
      }
    },
  };
}

interface SearchProps {
  scheduleInteractions: ScheduleInteractions;
  defaults?: SearchDefaults;
  loading?: boolean;
  term?: TermInfo;
  switchTerm: (termId: string) => void;
}

export default function Search({
  scheduleInteractions,
  defaults,
  loading,
  term,
  switchTerm,
}: SearchProps) {
  const { userOptions, alert } = useApp();
  const { schedule } = useData();
  const [search, setSearch] = useState(defaults?.query ?? '');
  const [searchMode, setSearchMode] = useState(SearchMode.NORMAL);
  const [filter, setFilter] = useState<FilterOptions>({});
  const [planCurrent, setPlanCurrent] = useState<string>();
  const [scheduleCurrent, setScheduleCurrent] = useState(
    defaults?.scheduleCurrent
  );
  const [browseSchool, setBrowseSchool] = useState<string>();
  const searchFieldRef = useRef<HTMLInputElement>(null);

  const updateFilter = useCallback(
    (newFilters: Partial<FilterOptions>, returnToNormalMode = false) => {
      const updated = { ...filter };
      for (const x in newFilters) {
        const f = x as keyof FilterOptions;
        if (!newFilters[f]) {
          delete updated[f];
          continue;
        }
        updated[f] = newFilters[f] as any;
      }

      // this isn't quite right
      setFilter(updated);
      setSearchMode(returnToNormalMode ? SearchMode.NORMAL : searchMode);
    },
    [filter, searchMode]
  );

  const { results, placeholder, shortcut } =
    useMemo<DisplayableSearchResults>(() => {
      const appMode = userOptions.get.mode as Mode;
      const results =
        userOptions.get.mode === Mode.PLAN
          ? searchPlan(search, filter)
          : searchSchedule(search, schedule, filter);

      if (search === 'angela') {
        return {
          placeholder: (
            <div className="flex justify-center">
              <button className="rounded-md bg-pink-500 px-2 py-1 font-bold text-white shadow-sm hover:bg-pink-400 active:bg-pink-300">
                ANGELA
              </button>
            </div>
          ),
        };
      }

      if (results === 'no_query') {
        if (searchMode !== SearchMode.NORMAL) {
          return {};
        }

        return {
          placeholder:
            appMode === Mode.PLAN ? (
              <SearchPlanPlaceholder />
            ) : (
              <SearchSchedulePlaceholder termName={term?.name || 'Unknown'} />
            ),
        };
      }

      if (results === 'too_short') {
        return {
          placeholder: (
            <SearchMessage
              title="Keep typing..."
              subtitle="You'll need at least 3 characters."
            />
          ),
        };
      }

      if (results === 'no_results') {
        return {
          placeholder: (
            <SearchMessage
              title="Aw, no results."
              subtitle={`Try refining your search.${
                filterExists(filter, appMode)
                  ? ' Note that omitted course results could be because of your active filters.'
                  : ''
              }`}
            />
          ),
        };
      }

      if (results === 'not_loaded') {
        return {
          placeholder: (
            <SearchMessage
              title="Data unavailable."
              subtitle="It looks like the course data failed to load. Try refreshing the page."
            />
          ),
        };
      }

      const courseList = [];
      if (appMode === Mode.PLAN) {
        for (const course of results.results as Course[]) {
          courseList.push(
            <SearchClass
              course={course}
              color={getCourseColor(course.id)}
              select={(courseId) => {
                setPlanCurrent(planCurrent === courseId ? undefined : courseId);
              }}
              selected={planCurrent === course.id}
              key={course.id}
            />
          );
        }
      } else {
        for (const course of results.results as ScheduleCourse[]) {
          courseList.push(
            <SearchScheduleClass
              course={course}
              color={getCourseColor(course.subject)}
              selected={scheduleCurrent === course.course_id}
              select={() => {
                setScheduleCurrent(
                  scheduleCurrent === course.course_id
                    ? undefined
                    : course.course_id
                );
              }}
              interactions={scheduleInteractions}
              filter={filter}
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
    }, [
      filter,
      planCurrent,
      schedule,
      scheduleCurrent,
      scheduleInteractions,
      search,
      searchMode,
      term?.name,
      userOptions.get.mode,
    ]);

  const darkMode = userOptions.get.dark;
  const queryEmpty = search.length === 0;
  const isLoading = loading || !term;
  const mapSection: ScheduleSection =
    scheduleInteractions.previewSection.get ||
    schedule.schedule[scheduleInteractions.hoverSection.get || ''];

  const isBrowsing = searchMode === SearchMode.BROWSE || filter.subject;
  const isBrowsingDeep =
    (searchMode === SearchMode.BROWSE && browseSchool) || filter.subject;
  const termName = term?.name ?? '-';
  const appMode = userOptions.get.mode as Mode;
  const isSchedule = appMode === Mode.SCHEDULE;
  const usingFilters = Object.keys(filter).length > 0;

  return (
    <div
      className={`${
        userOptions.get.tab === 'Search' ? '' : 'hidden '
      }border-4 my-2 flex flex-1 flex-col overflow-hidden rounded-2xl border-gray-400 shadow-lg dark:border-gray-500 ${
        isLoading ? 'items-center justify-center' : ''
      }`}
    >
      {isLoading ? (
        <SpinnerCircularFixed
          size={64}
          thickness={160}
          speed={200}
          color={darkMode ? 'rgb(212, 212, 212)' : 'rgb(115, 115, 115)'}
          secondaryColor={darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'}
        />
      ) : (
        <>
          <div className="mb-2 rounded-lg bg-white p-2 dark:bg-gray-800">
            <label className="relative mx-auto mb-2 mt-4 block w-11/12">
              <MagnifyingGlassIcon className="peer absolute left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 cursor-text stroke-2 text-gray-400" />
              <input
                className="important-focus-black dark:important-focus-white w-full rounded-lg border-2 border-gray-300 bg-white p-2 px-4
                     pl-8 text-black shadow-sm outline-none transition-all duration-150 placeholder:text-gray-400 hover:border-gray-500 focus:border-black peer-hover:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 dark:focus:border-white"
                ref={searchFieldRef}
                value={search}
                placeholder={`Search ${
                  isSchedule ? term?.name + '...' : 'for classes...'
                }`}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setScheduleCurrent(undefined);
                }}
              />
              {!queryEmpty && (
                <button
                  className="absolute bottom-0 right-4 top-0 my-2 block text-gray-300 transition-colors duration-150 
                                            hover:text-red-400 active:text-red-300 dark:text-gray-600 dark:hover:text-red-400 dark:active:text-red-500"
                  onClick={() => {
                    setSearch('');
                    searchFieldRef.current?.focus();
                  }}
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )}
            </label>
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
            {usingFilters && (
              <SearchFilterDisplay
                filter={{
                  get: filter,
                  set: updateFilter,
                }}
                appMode={appMode}
              />
            )}
            {queryEmpty && (
              <div className="m-4 flex justify-center gap-2">
                <SearchButton
                  fullWidth={!isSchedule}
                  tooltip={
                    isBrowsingDeep ? 'Back' : isBrowsing ? 'Close' : 'Browse'
                  }
                  color={isBrowsing ? 'green' : undefined}
                  action={() => {
                    if (filter.subject) {
                      const subj = filter.subject;
                      updateFilter({ subject: undefined });
                      setSearchMode(SearchMode.BROWSE);
                      setBrowseSchool(getSchoolOfSubject(subj));
                      return;
                    }
                    if (searchMode !== SearchMode.BROWSE) {
                      setSearchMode(SearchMode.BROWSE);
                      setBrowseSchool(undefined);
                      return;
                    }
                    if (browseSchool) {
                      setBrowseSchool(undefined);
                      return;
                    }

                    setSearchMode(SearchMode.NORMAL);
                  }}
                >
                  {isBrowsingDeep ? (
                    <ArrowSmallLeftIcon className="h-5 w-5" />
                  ) : isBrowsing ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <Bars3Icon className="h-5 w-5" />
                  )}
                </SearchButton>
                <SearchButton
                  fullWidth={!isSchedule}
                  tooltip="Filter"
                  color={usingFilters ? 'orange' : undefined}
                  action={() => {
                    alert({
                      title: 'Edit search filters',
                      icon: FunnelIcon,
                      message: `Filter search results for ${
                        appMode === Mode.PLAN ? 'plan' : 'schedule'
                      } data by any combination of the properties below.`,
                      form: {
                        sections:
                          appMode === Mode.PLAN
                            ? planSearchFilterForm(filter)
                            : scheduleSearchFilterForm(filter),
                        onSubmit: ({
                          subject,
                          meetingDays,
                          startAfter,
                          startBefore,
                          endAfter,
                          endBefore,
                          allAvailability,
                          components,
                          instructor,
                          location,
                          distros,
                          disciplines,
                          unitGeq,
                          unitLeq,
                          include,
                        }) => {
                          updateFilter({
                            subject: safe(subject)?.toUpperCase(),
                            meetingDays: safeArrayCommaSplit(meetingDays),
                            startAfter: parseTime(startAfter),
                            startBefore: parseTime(startBefore),
                            endAfter: parseTime(endAfter),
                            endBefore: parseTime(endBefore),
                            allAvailability:
                              safeArrayCommaSplit(allAvailability),
                            components: safeArrayCommaSplit(components),
                            instructor: safe(instructor)?.toLowerCase(),
                            location: safe(location)?.toLowerCase(),
                            distros: safeArrayCommaSplit(distros),
                            disciplines: safeArrayCommaSplit(disciplines),
                            unitGeq: safeNumber(unitGeq),
                            unitLeq: safeNumber(unitLeq),
                            include: safeArrayCommaSplit(include),
                          });
                        },
                      },
                      confirmButton: 'Apply',
                      color: 'orange',
                      cancelButton: 'Cancel',
                    });
                  }}
                >
                  <FunnelIcon className="h-5 w-5" />
                </SearchButton>
                {isSchedule && (
                  <SearchButton
                    fullWidth
                    tooltip="Change term"
                    action={() => {
                      alert(switchTermAlert(switchTerm, term?.id));
                    }}
                    color={getTermColor(termName)}
                  >
                    {termName}
                  </SearchButton>
                )}
              </div>
            )}
          </div>
          <div className="no-scrollbar flex-1 overflow-hidden overflow-y-scroll">
            {queryEmpty && !results && searchMode === SearchMode.BROWSE && (
              <SearchBrowse
                filter={{
                  get: filter,
                  set: updateFilter,
                }}
                school={browseSchool}
                setSchool={(school) => setBrowseSchool(school)}
              />
            )}
            {placeholder}
            {results}
          </div>
          {isSchedule && userOptions.get.minimap && (
            <div className="relative mt-2 hidden h-[25vh] rounded-lg bg-white dark:bg-gray-800 hsm:block">
              <CampusMinimap
                location={scheduleInteractions.hoverLocation.get}
                section={mapSection}
              />

              {/* <AnimatePresence>
                {roomFinderAvailable && (
                  <motion.div
                    initial={{ x: '-50%', y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                    className="absolute bottom-1 left-1/2 z-20 w-full -translate-x-1/2 px-2"
                  >
                    <p className="rounded-lg bg-white/50 px-1 py-0.5 text-center text-xs font-normal text-black backdrop-blur-md dark:bg-gray-700/50 dark:text-white">
                      ROOM FINDER AVAILABLE FROM COURSE INFO MENU
                    </p>
                  </motion.div>
                )}
              </AnimatePresence> */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
