import {
  createDocument,
  deleteDocument,
  getDocument,
  isLoggedIn,
  login,
  updateDocument,
} from '@/app/Account';
import { useApp } from '@/app/Context';
import { Document, RecentShareItem } from '@/types/AccountTypes';
import { Mode } from '@/utility/Constants';
import { PaperError } from '@/utility/PaperError';
import { errorAlert } from '@/utility/Utility';
import {
  CloudIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SpinnerCircularFixed } from 'spinners-react';
import AccountPlan from './AccountPlan';
import AccountPlanMessage from './AccountPlanMessage';
import RecentSharePlan from './RecentSharePlan';

const PLAN_LIMIT = 5;
const SCHEDULE_LIMIT = 20;

interface AccountPlansProps {
  recentShare?: RecentShareItem[];
  activatePlan: (planId: string) => void;
  activateSchedule: (scheduleId: string) => void;
  deactivate: () => void;
  activeId?: string;
  loading: boolean;
}

export default function AccountPlans(props: AccountPlansProps) {
  const { userOptions, alert } = useApp();
  const [plans, setPlans] = useState<Document[]>();
  const [schedules, setSchedules] = useState<Document[]>();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      getDocument('plans')
        .then((plans) => {
          // should only be undefined if a new access token is needed
          // a redirect should happen in that case
          if (!plans) return;

          getDocument('schedules')
            .then((schedules) => {
              if (!schedules) return;

              setPlans(plans);
              setSchedules(schedules);
              setLoading(false);
            })
            .catch((error: PaperError) => {
              alert(errorAlert('account_get_plans', error));
            });
        })
        .catch((error: PaperError) => {
          alert(errorAlert('account_get_plans', error));
        });
    }
  }, [alert]);

  const activate = useCallback(
    (id: string) => {
      if (userOptions.get.mode === Mode.SCHEDULE) {
        props.activateSchedule(id);
      } else {
        props.activatePlan(id);
      }
    },
    [props, userOptions.get.mode]
  );

  const create = useCallback(
    (isSchedule: boolean) => {
      const t = isSchedule ? 'schedule' : 'plan';

      alert({
        title: `Creating a new ${t}...`,
        message: `Let's add a new ${t} to your account! You'll need to give it a name.`,
        cancelButton: 'Cancel',
        confirmButton: 'Create',
        color: 'rose',
        icon: PlusIcon,
        textInput: {
          placeholder: 'Name',
          match: /^[\w\-\s]{1,24}$/,
          matchError: 'Alphanumeric, hyphens and spaces, 1-24 chars',
          focusByDefault: true,
        },
        action: ({ inputText: name }) => {
          if (!name) {
            alert(errorAlert(`account_create_${t}`, new PaperError('No Name')));
            return;
          }
          setLoading(true);
          toast.promise(
            createDocument(isSchedule ? 'schedules' : 'plans', name),
            {
              loading: `Creating ${t}...`,
              success: (res) => {
                if (isSchedule) {
                  setSchedules(res);
                } else {
                  setPlans(res);
                }
                setLoading(false);
                return `Created ${t}: ` + name;
              },
              error: (error: PaperError) => {
                alert(errorAlert(`account_create_${t}`, error));
                return 'Something went wrong';
              },
            }
          );
        },
      });
    },
    [alert]
  );

  const edit = useCallback(
    (id: string, name: string) => {
      const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
      const t = isSchedule ? 'schedule' : 'plan';
      alert({
        title: `Editing ${name}`,
        message: `Enter a new name for this ${t}.`,
        cancelButton: 'Cancel',
        confirmButton: 'Save',
        color: 'sky',
        icon: PencilIcon,
        textInput: {
          placeholder: 'Name',
          match: /^[\w\-\s]{1,24}$/,
          matchError: 'Alphanumeric, hyphens and spaces, 1-24 chars',
          focusByDefault: true,
          defaultValue: name,
        },
        action: ({ inputText: newName }) => {
          if (!newName) {
            alert(errorAlert(`account_edit_${t}`, new PaperError('No Name')));
            return;
          }
          setLoading(true);
          toast.promise(
            updateDocument(isSchedule ? 'schedules' : 'plans', id, {
              name: newName,
            }),
            {
              loading: `Updating ${t}...`,
              success: (res) => {
                if (isSchedule) {
                  setSchedules(res);
                } else {
                  setPlans(res);
                }
                setLoading(false);
                return `Renamed ${name} to ${newName}`;
              },
              error: (error: PaperError) => {
                alert(errorAlert(`account_edit_${t}`, error));
                return 'Something went wrong';
              },
            }
          );
        },
      });
    },
    [alert, userOptions.get.mode]
  );

  const duplicate = useCallback(
    (doc: Document) => {
      const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
      const t = isSchedule ? 'schedule' : 'plan';

      if (
        (isSchedule && (schedules?.length || 0) >= SCHEDULE_LIMIT) ||
        (!isSchedule && (plans?.length || 0) >= PLAN_LIMIT)
      ) {
        alert({
          title: `Maximum ${t} limit reached`,
          message: `You've reached the maximum number of ${t}s you can have in your account. You'll need to delete one before you can create a new one.`,
          color: 'sky',
          icon: DocumentDuplicateIcon,
          cancelButton: 'Close',
        });
        return;
      }

      alert({
        title: `Duplicating ${doc.name}`,
        message: `Enter a name for this duplicate ${t}.`,
        cancelButton: 'Cancel',
        confirmButton: 'Save',
        color: 'sky',
        icon: DocumentDuplicateIcon,
        textInput: {
          placeholder: 'Name',
          match: /^[\w\-\s]{1,24}$/,
          matchError: 'Alphanumeric, hyphens and spaces, 1-24 chars',
          focusByDefault: true,
          defaultValue: doc.name,
        },
        action: ({ inputText: name }) => {
          if (!name) {
            alert(
              errorAlert(`account_duplicate_${t}`, new PaperError('No Name'))
            );
            return;
          }
          setLoading(true);
          toast.promise(
            createDocument(isSchedule ? 'schedules' : 'plans', name, {
              data: doc.data,
              notes: doc.notes,
            }),
            {
              loading: `Duplicating ${doc.name}...`,
              success: (res) => {
                if (isSchedule) {
                  setSchedules(res);
                } else {
                  setPlans(res);
                }
                setLoading(false);
                return `Created ${t}: ${name}`;
              },
              error: (error: PaperError) => {
                alert(errorAlert(`account_duplicate_${t}`, error));
                return 'Something went wrong';
              },
            }
          );
        },
      });
    },
    [alert, plans?.length, schedules?.length, userOptions.get.mode]
  );

  const destroy = useCallback(
    (id: string, name: string) => {
      const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
      const t = isSchedule ? 'schedule' : 'plan';

      alert({
        title: `Delete this ${t}?`,
        message: `Are you sure you want to delete your ${t} named '${name}' from your account? If it's active right now, it'll stay there, but it won't be linked to your account anymore.`,
        cancelButton: 'Cancel',
        confirmButton: 'Delete',
        color: 'red',
        icon: TrashIcon,
        action: () => {
          setLoading(true);
          toast.promise(
            deleteDocument(isSchedule ? 'schedules' : 'plans', id),
            {
              loading: `Deleting ${t}...`,
              success: (res) => {
                if (isSchedule) {
                  setSchedules(res);
                  if (userOptions.get.active_schedule_id === id) {
                    userOptions.set('active_schedule_id', 'None', true);
                  }
                } else {
                  setPlans(res);
                  if (userOptions.get.active_plan_id === id) {
                    userOptions.set('active_plan_id', 'None', true);
                  }
                }
                setLoading(false);
                return `Deleted ${t}: ` + name;
              },
              error: (error: PaperError) => {
                alert(errorAlert(`account_delete_${t}`, error));
                return 'Something went wrong';
              },
            },
            {
              success: {
                iconTheme: {
                  primary: 'red',
                  secondary: 'white',
                },
              },
            }
          );
        },
      });
    },
    [alert, userOptions]
  );

  let items: JSX.Element[] = [];
  const isSchedule = userOptions.get.mode === Mode.SCHEDULE;
  const t = isSchedule ? 'schedule' : 'plan';
  const darkMode = userOptions.get.dark as boolean;

  if (isSchedule) {
    items =
      schedules
        ?.sort((a, b) => {
          const diff =
            (a.lastUpdated || a.createdAt) - (b.lastUpdated || b.createdAt);

          if (diff > 0) return -1;
          if (diff < 0) return 1;
          return 0;
        })
        .map((schedule, i) => {
          return (
            <AccountPlan
              id={schedule.id}
              plan={schedule}
              active={schedule.id === props.activeId}
              activate={activate}
              deactivate={props.deactivate}
              rename={edit}
              duplicate={duplicate}
              destroy={destroy}
              key={`account-schedule-${i}`}
            />
          );
        }) || [];
  } else {
    items =
      plans
        ?.sort((a, b) => {
          const diff =
            (a.lastUpdated || a.createdAt) - (b.lastUpdated || b.createdAt);

          if (diff > 0) return -1;
          if (diff < 0) return 1;
          return 0;
        })
        .map((plan, i) => {
          return (
            <AccountPlan
              id={plan.id}
              plan={plan}
              active={plan.id === props.activeId}
              activate={activate}
              deactivate={props.deactivate}
              rename={edit}
              duplicate={duplicate}
              destroy={destroy}
              key={`account-plan-${i}`}
            />
          );
        }) || [];
  }

  const recentShare =
    props.recentShare &&
    props.recentShare
      .filter((share) => share.type === (isSchedule ? 2 : 1))
      .map((share, i) => (
        <RecentSharePlan data={share} key={`recent-share-${i}`} />
      ));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="no-scrollbar my-2 h-full overflow-y-scroll rounded-2xl border-4
            border-rose-300 shadow-lg"
    >
      <p className="my-4 text-center text-2xl font-bold text-rose-300">
        {isSchedule ? 'SCHEDULES' : 'PLANS'}
      </p>
      {!loggedIn ? (
        <AccountPlanMessage
          icon={<CloudIcon className="h-12 w-12" />}
          title="Save your stuff"
          description="By creating an account, you can save up to 5 plans and 20 schedules. You can access them from any device at any time. It's super simple."
          primaryButton={{
            text: 'Log in',
            action: () => {
              login();
            },
          }}
        />
      ) : loading || loading ? (
        <AccountPlanMessage
          icon={
            <SpinnerCircularFixed
              size={64}
              thickness={160}
              speed={200}
              color={darkMode ? 'rgb(251, 113, 133)' : 'rgb(244, 63, 94)'}
              secondaryColor={
                darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'
              }
            />
          }
        />
      ) : (
        <>
          <p className="mx-4 text-center text-xs text-gray-500">
            {items.length === 0
              ? `It looks like you don't have any ${t}s yet. When you create one, it'll appear here.`
              : `Select a ${t} to activate it, and again to deactivate it. Activating empty ${t}s won't overwrite current ${t} data.`}
          </p>
          <div className="m-4 block">{items}</div>
          {items.length < (isSchedule ? SCHEDULE_LIMIT : PLAN_LIMIT) && (
            <button
              className="mx-auto my-4 block rounded-lg bg-rose-300 px-4 py-1 text-sm text-white
                                shadow-sm hover:bg-rose-400 active:bg-rose-500
                                dark:bg-rose-600 dark:hover:bg-rose-500 dark:active:bg-rose-400"
              onClick={() => {
                create(isSchedule);
              }}
            >
              Create {t}
            </button>
          )}
          {(recentShare?.length || 0) > 0 && (
            <>
              <hr className="mx-12 my-8 border-gray-200 dark:border-gray-600" />
              <p className="my-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">
                RECENTLY VIEWED SHARED {t.toUpperCase()}S
              </p>
              <div className="m-4 block">{recentShare}</div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
