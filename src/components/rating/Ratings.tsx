import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon,
  ClockIcon,
  PresentationChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { Fragment, useEffect, useState } from 'react';
import Account from '../../Account';
import { getTermName } from '../../DataManager';
import PlanManager from '../../PlanManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { BarChartValue } from '../../types/GenericMenuTypes';
import {
  CourseRatings,
  OverallRating,
  RatingsViewData,
  SectionCourseRatings,
} from '../../types/RatingTypes';
import { TIME_COMMITMENT_LEVELS } from '../../utility/Constants';
import { PaperError } from '../../utility/PaperError';
import {
  chooseCommitmentRatingSummary,
  chooseInstructorRatingSummary,
  chooseOverallRatingSummary,
} from '../../utility/RatingMessages';
import Utility from '../../utility/Utility';
import RatingDisplay from './RatingDisplay';
import { SpinnerCircularFixed } from 'spinners-react';

interface RatingsProps {
  data: RatingsViewData;
  alert: Alert;
  switches: UserOptions;
  onClose: () => void;
}

export default function Ratings({
  data,
  alert,
  switches,
  onClose,
}: RatingsProps) {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<'loading' | 'not-logged-in' | 'done'>(
    'not-logged-in'
  );
  const [ratings, setRatings] = useState<CourseRatings | null>(null);
  const [[selectedRatingsId, selectedRatings], setSelectedRatings] = useState<
    [string | null, SectionCourseRatings | null]
  >([null, null]);

  const darkMode = switches.get.dark;
  const color = PlanManager.getCourseColor(data.course);

  useEffect(() => {
    setState('loading');
    setRatings(null);
    if (Account.isLoggedIn()) {
      Account.getDetailedRatings(data.course)
        .then((ratings) => {
          if (!ratings) {
            setState('not-logged-in');
            return;
          }

          setState('done');
          setRatings(ratings);
          console.log(ratings);
        })
        .catch((error: PaperError) => {
          if (error.status === 404) {
            setState('done');
            setRatings({});
            return;
          }
          alert(Utility.errorAlert('account_get_plans', error));
        });
    } else {
      setState('not-logged-in');
    }
  }, [data.course, alert]);

  const overallRatings: BarChartValue[] = [];
  const commitmentRatings: BarChartValue[] = [];
  const instructorRatings: BarChartValue[] = [];

  if (selectedRatings) {
    for (let i = 1; i <= 5; i++) {
      overallRatings.push({
        label: `${i}`,
        value: selectedRatings.overall?.[i as keyof OverallRating] || 0,
      });
      commitmentRatings.push({
        label: TIME_COMMITMENT_LEVELS[i - 1],
        value: selectedRatings.commitment?.[i as keyof OverallRating] || 0,
      });
      instructorRatings.push({
        label: `${i}`,
        value: selectedRatings.instructor?.[i as keyof OverallRating] || 0,
      });
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`${darkMode ? 'dark' : ''} relative z-40`}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => onClose()}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="relative flex h-screen w-screen items-center justify-center p-4 text-center md:p-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-white p-2 text-left dark:bg-gray-700">
                <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                  {ratings ? (
                    <>
                      <div className="flex w-full flex-col gap-4 overflow-hidden p-4 md:max-w-xs">
                        <div className="md:text-left">
                          <p className="text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400">
                            PAPER RATINGS
                          </p>
                          <p
                            className={`text-3xl font-bold text-${color}-500 dark:text-${color}-300`}
                          >
                            {data.course}
                          </p>
                        </div>
                        <div className="no-scrollbar flex-1 overflow-y-scroll">
                          {Object.keys(ratings)
                            .sort((a, b) => b.localeCompare(a))
                            .map((termId) => (
                              <div className="my-2 flex flex-col items-center gap-1 md:items-start">
                                <p className="text-lg text-gray-500 dark:text-gray-400">
                                  {getTermName(termId)}
                                </p>
                                {Object.keys(ratings[termId]).map((prof) => {
                                  const ratingsId = `${termId},${prof}`;
                                  return (
                                    <button
                                      className={`flex w-full items-center gap-1 rounded-md p-1 px-4 text-left transition-all duration-150 ${
                                        ratingsId === selectedRatingsId
                                          ? `bg-${color}-500 text-white dark:bg-${color}-400 shadow-md`
                                          : 'text-black hover:bg-gray-100 active:bg-gray-200 dark:text-white dark:hover:bg-gray-600 dark:active:bg-gray-500'
                                      }`}
                                      onClick={() => {
                                        setSelectedRatings([
                                          ratingsId,
                                          ratings[termId][prof],
                                        ]);
                                      }}
                                    >
                                      <span className="flex-1">{prof}</span>
                                      <ChevronRightIcon className="h-3 w-3" />
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                        </div>
                        <button
                          className={`flex w-full items-center justify-center gap-1 rounded-lg font-bold bg-${color}-500 dark:bg-${color}-400 p-2 text-sm text-white shadow-md hover:opacity-75 active:opacity-60`}
                          onClick={() => {}}
                        >
                          <PlusIcon className="h-4 w-4 stroke-2" />
                          <span>RATE THIS COURSE</span>
                        </button>
                      </div>
                      <div className="no-scrollbar flex h-full flex-1 flex-col gap-8 overflow-y-scroll px-4 py-8">
                        {selectedRatingsId && selectedRatings ? (
                          <>
                            <RatingDisplay
                              chartId={`${selectedRatingsId}-overall`}
                              title="OVERALL RATING"
                              Icon={StarIcon}
                              description={`The overall student rating of the course taught by this instructor this quarter. ${chooseOverallRatingSummary(
                                selectedRatings.overall
                              )}`}
                              values={overallRatings}
                              labelClassName="w-12"
                            />
                            <RatingDisplay
                              chartId={`${selectedRatingsId}-commitment`}
                              title="TIME COMMITMENT"
                              Icon={ClockIcon}
                              description={`The approximate time, in hours, that students spent working on classwork outside of class. ${chooseCommitmentRatingSummary(
                                selectedRatings.commitment
                              )}`}
                              values={commitmentRatings}
                              labelClassName="w-12"
                            />
                            <RatingDisplay
                              chartId={`${selectedRatingsId}-commitment`}
                              title="INSTRUCTOR RATING"
                              Icon={AcademicCapIcon}
                              description={`What students thought of this course's instructor, ${
                                selectedRatingsId.split(',')[1]
                              }. ${chooseInstructorRatingSummary(
                                selectedRatings.instructor
                              )}`}
                              values={instructorRatings}
                              labelClassName="w-12"
                            />
                            {/* <RatingDisplay
                              chartId={`${selectedRatingsId}-overall`}
                              title="OVERALL RATING"
                              description="The overall rating of the course taught by this instructor this quarter."
                              values={overallRatings}
                            />
                            <RatingDisplay
                              chartId={`${selectedRatingsId}-overall`}
                              title="OVERALL RATING"
                              description="The overall rating of the course taught by this instructor this quarter."
                              values={overallRatings}
                            /> */}
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
                            <PresentationChartBarIcon className="h-12 w-12" />
                            <p className="max-w-sm text-center text-sm">
                              Select a section to view its ratings.
                            </p>
                          </div>
                        )}
                        {/* <RatingDisplay />
                        <RatingDisplay /> */}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-black dark:text-white">
                      {state === 'loading' ? (
                        <>
                          <SpinnerCircularFixed
                            size={64}
                            thickness={160}
                            speed={200}
                            color={
                              darkMode
                                ? 'rgb(212, 212, 212)'
                                : 'rgb(115, 115, 115)'
                            }
                            secondaryColor={
                              darkMode
                                ? 'rgb(64, 64, 64)'
                                : 'rgba(245, 245, 245)'
                            }
                          />
                        </>
                      ) : (
                        <>
                          <PresentationChartBarIcon className="h-12 w-12" />
                          <p className="text-2xl font-bold">PAPER RATINGS</p>
                          <p className="max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
                            Paper Ratings allow you to see what students think
                            of a course, like {data.course}. Check out a
                            course's overall rating, time commitment, and
                            instructor rating, alongside a distribution of
                            student-submitted grades, right from here!
                          </p>
                          <button
                            className="m-2 rounded-lg bg-black p-2 text-white shadow-lg hover:opacity-75 active:opacity-60 dark:bg-white dark:text-black"
                            onClick={() => Account.logIn()}
                          >
                            Sign in to continue
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    Paper Ratings are not connected to nor intended to replace
                    CTECs. Make sure to complete your CTECs for access to
                    detailed ratings and comments. All ratings and grades are
                    submitted by students on Paper.
                  </p>
                </div>
                <button
                  className="absolute right-2 top-2"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon
                    className="h-8 w-8 text-gray-300 hover:text-black active:text-gray-600
                    dark:text-gray-500 dark:hover:text-white dark:active:text-gray-300"
                  />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
