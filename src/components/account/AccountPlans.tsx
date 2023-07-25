import {
  CloudIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';
import toast from 'react-hot-toast';
import { SpinnerCircularFixed } from 'spinners-react';
import Account from '../../Account';
import {
  AccountModificationFunctions,
  Document,
} from '../../types/AccountTypes';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';
import { PaperError } from '../../utility/PaperError';
import Utility from '../../utility/Utility';
import AccountPlan from './AccountPlan';
import AccountPlanMessage from './AccountPlanMessage';

const PLAN_LIMIT = 5;
const SCHEDULE_LIMIT = 20;

interface AccountPlansProps {
  switches: UserOptions;
  alert: Alert;
  activatePlan: (planId: string) => void;
  activateSchedule: (scheduleId: string) => void;
  deactivate: () => void;
  activeId?: string;
  loading: boolean;
}

interface AccountPlansState {
  plans?: Document[];
  schedules?: Document[];
  loading: boolean;
  loggedIn: boolean;
  fa: AccountModificationFunctions;
}

class AccountPlans extends React.Component<
  AccountPlansProps,
  AccountPlansState
> {
  constructor(props: AccountPlansProps) {
    super(props);

    let self = this;

    let fa: AccountModificationFunctions = {
      activate: (id) => {
        if (props.switches.get.mode === Mode.SCHEDULE) {
          props.activateSchedule(id);
        } else {
          props.activatePlan(id);
        }
      },
      deactivate: () => {
        props.deactivate();
      },
      rename: (id, name) => {
        self.edit(id, name);
      },
      duplicate: (doc) => {
        self.duplicate(doc);
      },
      delete: (id, name) => {
        self.delete(id, name);
      },
    };

    this.state = {
      loading: true,
      loggedIn: false,
      fa,
    };
  }

  componentDidMount() {
    if (Account.isLoggedIn()) {
      this.setState({ loggedIn: true });
      Account.get('plans')
        .then((plans) => {
          // should only be undefined if a new access token is needed
          // a redirect should happen in that case
          if (!plans) return;

          Account.get('schedules')
            .then((schedules) => {
              if (!schedules) return;

              this.setState({
                plans,
                schedules,
                loading: false,
                loggedIn: true,
              });
            })
            .catch((error: PaperError) => {
              this.props.alert(Utility.errorAlert('account_get_plans', error));
            });
        })
        .catch((error: PaperError) => {
          this.props.alert(Utility.errorAlert('account_get_plans', error));
        });
    }
  }

  create(isSchedule: boolean) {
    const self = this;
    const t = isSchedule ? 'schedule' : 'plan';

    this.props.alert({
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
          self.props.alert(
            Utility.errorAlert(`account_create_${t}`, new PaperError('No Name'))
          );
          return;
        }
        self.setState({ loading: true });
        toast.promise(
          Account.create(isSchedule ? 'schedules' : 'plans', name),
          {
            loading: `Creating ${t}...`,
            success: (res) => {
              if (isSchedule) {
                self.setState({
                  schedules: res,
                  loading: false,
                });
              } else {
                self.setState({
                  plans: res,
                  loading: false,
                });
              }
              return `Created ${t}: ` + name;
            },
            error: (error: PaperError) => {
              self.props.alert(
                Utility.errorAlert(`account_create_${t}`, error)
              );
              return 'Something went wrong';
            },
          }
        );
      },
    });
  }

  edit(id: string, name: string) {
    const self = this;
    const isSchedule = this.props.switches.get.mode === Mode.SCHEDULE;
    const t = isSchedule ? 'schedule' : 'plan';
    this.props.alert({
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
          self.props.alert(
            Utility.errorAlert(`account_edit_${t}`, new PaperError('No Name'))
          );
          return;
        }
        self.setState({ loading: true });
        toast.promise(
          Account.update(isSchedule ? 'schedules' : 'plans', id, {
            name: newName,
          }),
          {
            loading: `Updating ${t}...`,
            success: (res) => {
              if (isSchedule) {
                self.setState({
                  schedules: res,
                  loading: false,
                });
              } else {
                self.setState({
                  plans: res,
                  loading: false,
                });
              }
              return `Renamed ${name} to ${newName}`;
            },
            error: (error: PaperError) => {
              self.props.alert(Utility.errorAlert(`account_edit_${t}`, error));
              return 'Something went wrong';
            },
          }
        );
      },
    });
  }

  duplicate(doc: Document) {
    const self = this;
    const isSchedule = this.props.switches.get.mode === Mode.SCHEDULE;
    const t = isSchedule ? 'schedule' : 'plan';

    if (
      (isSchedule && (this.state.schedules?.length || 0) >= SCHEDULE_LIMIT) ||
      (!isSchedule && (this.state.plans?.length || 0) >= PLAN_LIMIT)
    ) {
      this.props.alert({
        title: `Maximum ${t} limit reached`,
        message: `You've reached the maximum number of ${t}s you can have in your account. You'll need to delete one before you can create a new one.`,
        color: 'sky',
        icon: DocumentDuplicateIcon,
        cancelButton: 'Close',
      });
      return;
    }

    this.props.alert({
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
          self.props.alert(
            Utility.errorAlert(
              `account_duplicate_${t}`,
              new PaperError('No Name')
            )
          );
          return;
        }
        self.setState({ loading: true });
        toast.promise(
          Account.create(isSchedule ? 'schedules' : 'plans', name, {
            content: doc.content,
            notes: doc.notes,
          }),
          {
            loading: `Duplicating ${doc.name}...`,
            success: (res) => {
              if (isSchedule) {
                self.setState({
                  schedules: res,
                  loading: false,
                });
              } else {
                self.setState({
                  plans: res,
                  loading: false,
                });
              }
              return `Created ${t}: ${name}`;
            },
            error: (error: PaperError) => {
              self.props.alert(
                Utility.errorAlert(`account_duplicate_${t}`, error)
              );
              return 'Something went wrong';
            },
          }
        );
      },
    });
  }

  delete(id: string, name: string) {
    const self = this;
    const isSchedule = this.props.switches.get.mode === Mode.SCHEDULE;
    const t = isSchedule ? 'schedule' : 'plan';

    this.props.alert({
      title: `Delete this ${t}?`,
      message: `Are you sure you want to delete your ${t} named '${name}' from your account? If it's active right now, it'll stay there, but it won't be linked to your account anymore.`,
      cancelButton: 'Cancel',
      confirmButton: 'Delete',
      color: 'red',
      icon: TrashIcon,
      action: () => {
        self.setState({ loading: true });
        toast.promise(
          Account.delete(isSchedule ? 'schedules' : 'plans', id),
          {
            loading: `Deleting ${t}...`,
            success: (res) => {
              if (isSchedule) {
                self.setState({
                  schedules: res,
                  loading: false,
                });
                let switches = this.props.switches;
                if (switches.get.active_schedule_id === id) {
                  this.props.switches.set('active_schedule_id', 'None', true);
                }
                return 'Deleted schedule: ' + name;
              } else {
                self.setState({
                  plans: res,
                  loading: false,
                });
                let switches = this.props.switches;
                if (switches.get.active_plan_id === id) {
                  this.props.switches.set('active_plan_id', 'None', true);
                }
                return 'Deleted plan: ' + name;
              }
            },
            error: (error: PaperError) => {
              self.props.alert(
                Utility.errorAlert(`account_delete_${t}`, error)
              );
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
  }

  render() {
    let items: JSX.Element[] = [];
    const isSchedule = this.props.switches.get.mode === Mode.SCHEDULE;
    const t = isSchedule ? 'schedule' : 'plan';
    const darkMode = this.props.switches.get.dark as boolean;

    if (isSchedule) {
      let self = this;
      items =
        this.state.schedules
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
                fa={self.state.fa}
                active={schedule.id === self.props.activeId}
                key={`account-schedule-${i}`}
              />
            );
          }) || [];
    } else {
      let self = this;
      items =
        this.state.plans
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
                fa={self.state.fa}
                active={plan.id === self.props.activeId}
                key={`account-plan-${i}`}
              />
            );
          }) || [];
    }

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
        {!this.state.loggedIn ? (
          <AccountPlanMessage
            icon={<CloudIcon className="h-12 w-12" />}
            title="Save your stuff"
            description="By creating an account, you can save up to 5 plans and 10 schedules. You can access them from any device at any time. It's super simple."
            primaryButton={{
              text: 'Log in',
              action: () => {
                Account.logIn();
              },
            }}
          />
        ) : this.state.loading || this.props.loading ? (
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
            <p className="mx-8 text-center text-sm text-gray-500">
              {items.length === 0
                ? `It looks like you don't have any ${t}s yet. When you create one, it'll appear here.`
                : `Select a ${t} to activate it, and again to deactivate it. Activating empty ${t}s won't overwrite current ${t} data.`}
            </p>
            <div className="m-4 block">{items}</div>
            {items.length < (isSchedule ? SCHEDULE_LIMIT : PLAN_LIMIT) && (
              <button
                className="mx-auto my-4 block rounded-lg bg-rose-300 px-4 py-1 text-sm text-white
                                shadow-sm hover:bg-rose-400 dark:bg-rose-600 dark:hover:bg-rose-500"
                onClick={() => {
                  this.create(isSchedule);
                }}
              >
                Create {t}
              </button>
            )}
          </>
        )}
      </motion.div>
    );
  }
}

export default AccountPlans;
