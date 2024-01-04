import { Dialog, Transition } from '@headlessui/react';
import {
  PencilSquareIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PresentationChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { Fragment, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SpinnerCircularFixed } from 'spinners-react';
import Account from '../../Account';
import PlanManager from '../../PlanManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { BarChartValue } from '../../types/GenericMenuTypes';
import {
  CourseRating,
  OverallRating,
  RatingInfo,
  RatingsObject,
  RatingsViewData,
} from '../../types/RatingTypes';
import {
  GRADE_LEVELS,
  OVERALL_LEVELS,
  TIME_COMMITMENT_LEVELS,
} from '../../utility/Constants';
import { ratingsForm } from '../../utility/Forms';
import { PaperError } from '../../utility/PaperError';
import {
  chooseCommitmentRatingSummary,
  chooseOverallRatingSummary,
  ratingAverage,
} from '../../utility/RatingMessages';
import Utility from '../../utility/Utility';
import RatingDisplay from './RatingDisplay';
import ActionButton from '../generic/ActionButton';
import Tooltip from '../generic/Tooltip';
import Links from '../../utility/StaticLinks';

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
  const [state, setState] = useState<
    'loading' | 'not-logged-in' | 'done' | 'error'
  >('not-logged-in');
  const [ratings, setRatings] = useState<RatingInfo | null>(null);

  const darkMode = switches.get.dark;
  const color = PlanManager.getCourseColor(data.course);

  const update = useCallback(
    (reload: boolean) => {
      setState('loading');
      setRatings(null);
      if (Account.isLoggedIn()) {
        Account.getDetailedRatings(data.course, reload)
          .then((ratings) => {
            if (!ratings) {
              setState('not-logged-in');
              return;
            }

            setState('done');
            setRatings(ratings);
          })
          .catch((error: PaperError) => {
            if (error.status === 404) {
              setState('done');
              setRatings({
                ratings: {},
                rated: false,
              });
              return;
            }
            console.error(error);
            setState('error');
          });
      } else {
        setState('not-logged-in');
      }
    },
    [data.course]
  );

  useEffect(() => {
    update(false);
  }, [update]);

  const barChartValues: RatingsObject<BarChartValue[]> = {
    overall: [],
    commitment: [],
    grade: [],
  };

  if (ratings) {
    for (let i = 1; i <= 5; i++) {
      const overallVal =
        ratings.ratings.overall?.[i as keyof OverallRating] || 0;
      barChartValues.overall.push({
        label: `${i}`,
        value: overallVal,
      });

      const commitmentVal =
        ratings.ratings.commitment?.[i as keyof OverallRating] || 0;
      barChartValues.commitment.push({
        label: TIME_COMMITMENT_LEVELS[i - 1],
        value: commitmentVal,
      });
    }

    for (let i = 1; i <= 16; i++) {
      const gradeVal = ratings.ratings.grade?.[i as keyof OverallRating] || 0;
      barChartValues.grade.push({
        label: GRADE_LEVELS[i - 1],
        value: gradeVal,
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
                <div className="flex flex-1 flex-col overflow-hidden">
                  {ratings ? (
                    <>
                      <div className="flex w-full flex-col items-start gap-4 overflow-hidden p-4">
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
                        <button
                          disabled={ratings.rated}
                          className={`flex items-center justify-center gap-1 rounded-lg font-bold bg-${color}-500 dark:bg-${color}-400 w-full max-w-[240px] p-2 text-sm text-white shadow-md hover:opacity-75 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50`}
                          onClick={() => {
                            alert({
                              title: `Rate ${data.course}`,
                              message:
                                "Select a rating for any categories you'd like. All rating categories are optional, so feel free to rate as much or as little as you'd like.",
                              color: 'amber',
                              icon: PencilSquareIcon,
                              notice: {
                                type: 'note',
                                message:
                                  'You will not be able to change this later. Only rate courses you have taken.',
                              },
                              form: {
                                sections: ratingsForm(),
                                onSubmit: (formData) => {
                                  const rating: CourseRating = {
                                    overall: formData.overall
                                      ? OVERALL_LEVELS.indexOf(
                                          formData.overall
                                        ) + 1
                                      : undefined,
                                    commitment: formData.commitment
                                      ? TIME_COMMITMENT_LEVELS.indexOf(
                                          formData.commitment
                                        ) + 1
                                      : undefined,
                                    grade: formData.grade
                                      ? GRADE_LEVELS.indexOf(formData.grade) + 1
                                      : undefined,
                                  };

                                  toast.promise(
                                    Account.rate(data.course, rating),
                                    {
                                      loading: `Submitting rating...`,
                                      success: () => {
                                        update(true);
                                        return `Rating submitted for ${data.course}!`;
                                      },
                                      error: (error: PaperError) => {
                                        alert(
                                          Utility.errorAlert(
                                            'ratings_submit',
                                            error
                                          )
                                        );
                                        return 'Something went wrong.';
                                      },
                                    }
                                  );
                                },
                              },
                              confirmButton: 'Submit rating',
                              cancelButton: 'Cancel',
                            });
                          }}
                        >
                          <PlusIcon className="h-4 w-4 stroke-2" />
                          <span>
                            {ratings.rated
                              ? 'COURSE ALREADY RATED'
                              : 'RATE THIS COURSE'}
                          </span>
                        </button>
                      </div>
                      <div className="no-scrollbar flex h-full flex-1 flex-col gap-8 overflow-y-scroll px-4 py-8">
                        {ratings ? (
                          <>
                            <RatingDisplay
                              chartId="overall"
                              title="OVERALL RATING"
                              Icon={StarIcon}
                              description={`The overall student rating of the course. ${chooseOverallRatingSummary(
                                ratings.ratings.overall
                              )}`}
                              values={barChartValues.overall}
                              calculations={ratingAverage(
                                ratings.ratings.overall
                              )}
                              labelClassName="w-12"
                            />
                            <RatingDisplay
                              chartId="commitment"
                              title="TIME COMMITMENT"
                              Icon={ClockIcon}
                              description={`The approximate time, in hours, that students spent working on classwork outside of class. ${chooseCommitmentRatingSummary(
                                ratings.ratings.commitment
                              )}`}
                              values={barChartValues.commitment}
                              calculations={ratingAverage(
                                ratings.ratings.commitment
                              )}
                              labelClassName="w-12"
                            />
                            <RatingDisplay
                              mode="horizontal"
                              chartId="grades"
                              title="GRADES"
                              Icon={AcademicCapIcon}
                              description="The distribution of grades received by students in this course."
                              values={barChartValues.grade}
                              calculations={ratingAverage(
                                ratings.ratings.grade
                              )}
                            />
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
                            <PresentationChartBarIcon className="h-12 w-12" />
                            <p className="max-w-sm text-center text-sm">
                              Select a section to view its ratings.
                            </p>
                          </div>
                        )}
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
                      ) : state === 'error' ? (
                        <>
                          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 dark:text-red-400" />
                          <p className="text-red-500 dark:text-red-400">
                            Something went wrong when loading ratings.
                          </p>
                        </>
                      ) : (
                        <>
                          <PresentationChartBarIcon className="h-12 w-12" />
                          <p className="text-2xl font-bold">PAPER RATINGS</p>
                          <p className="max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
                            Paper Ratings allow you to see what students think
                            of a course, like {data.course}. Check out a
                            course's overall rating and time commitment,
                            alongside a distribution of student-submitted
                            grades, right from here!
                          </p>
                          <button
                            className="m-2 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white shadow-lg hover:opacity-75 active:opacity-60 dark:bg-white dark:text-black"
                            onClick={() => Account.logIn()}
                          >
                            SIGN IN TO CONTINUE
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
                    detailed ratings and comments. Ratings and grades are not
                    certified and are submitted by authenticated Paper users.
                    Paper Ratings are not official course ratings.
                  </p>
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-2">
                  <ActionButton
                    padding="large"
                    onClick={() =>
                      window.open(Links.SUPPORT_RATINGS, '_blank', 'noreferrer')
                    }
                  >
                    <QuestionMarkCircleIcon className="h-6 w-6" />
                    <Tooltip className="-bottom-9 right-0" color="gray">
                      Help with Paper Ratings
                    </Tooltip>
                  </ActionButton>
                  <ActionButton onClick={() => setOpen(false)}>
                    <XMarkIcon className="h-8 w-8" />
                    <Tooltip className="-bottom-9 right-0" color="gray">
                      Close
                    </Tooltip>
                  </ActionButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
