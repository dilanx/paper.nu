import { ExclamationIcon, SaveIcon } from '@heroicons/react/outline';
import debug from 'debug';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import Account from './Account';
import {
  addBookmark,
  addCourse,
  addSummerQuarter,
  addYear,
  clearData,
  moveCourse,
  removeBookmark,
  removeCourse,
} from './app/PlanModification';
import {
  addScheduleBookmark,
  addSection,
  removeScheduleBookmark,
  removeSection,
} from './app/ScheduleModification';
import AccountPlans from './components/account/AccountPlans';
import Bookmarks from './components/bookmarks/Bookmarks';
import Alert from './components/menu/alert/Alert';
import Info from './components/menu/Info';
import TaskBar from './components/menu/TaskBar';
import Content from './components/plan/Content';
import Schedule from './components/schedule/Schedule';
import Search from './components/search/Search';
import PlanManager from './PlanManager';
import SaveDataManager from './SaveDataManager';
import { AlertData } from './types/AlertTypes';
import { AppState, ReadUserOptions } from './types/BaseTypes';
import {
  Course,
  PlanData,
  PlanModificationFunctions,
  PlanSpecialFunctions,
} from './types/PlanTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from './types/ScheduleTypes';
import { Mode } from './utility/Constants';
import PlanError from './utility/PlanError';
import Utility from './utility/Utility';
var d = debug('app');

const VERSION = process.env.REACT_APP_VERSION ?? 'UNKNOWN';

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    let defaultSwitches = SaveDataManager.loadSwitchesFromStorage(
      (key, value, save) => {
        this.setSwitch(key, value, save);
      }
    );
    defaultSwitches.get.tab = 'Search';

    let app = this;

    let data: PlanData = {
      courses: [
        [[], [], []],
        [[], [], []],
        [[], [], []],
        [[], [], []],
      ],
      bookmarks: {
        noCredit: new Set<Course>(),
        forCredit: new Set<Course>(),
      },
    };

    const f: PlanModificationFunctions = {
      addCourse: (course, location) => {
        addCourse(app, course, location);
      },
      removeCourse: (courseIndex, location) => {
        removeCourse(app, courseIndex, location);
      },
      moveCourse: (course, oldLocation, newLocation) => {
        moveCourse(app, course, oldLocation, newLocation);
      },
      addBookmark: (course, forCredit) => {
        addBookmark(app, course, forCredit);
      },
      removeBookmark: (course, forCredit) => {
        removeBookmark(app, course, forCredit);
      },
    };

    const f2: PlanSpecialFunctions = {
      addSummerQuarter: (year) => {
        addSummerQuarter(app, year);
      },
      addYear: () => {
        addYear(app);
      },
      clearData: (year?: number) => {
        clearData(app, year);
      },
    };

    const sf: ScheduleModificationFunctions = {
      addSection: (section) => addSection(app, section),
      removeSection: (section) => removeSection(app, section),
      addScheduleBookmark: (course) => addScheduleBookmark(app, course),
      removeScheduleBookmark: (course) => removeScheduleBookmark(app, course),
    };

    if (defaultSwitches.get.dark) {
      document.body.style.backgroundColor = Utility.BACKGROUND_DARK;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', Utility.BACKGROUND_DARK);
    } else {
      document.body.style.backgroundColor = Utility.BACKGROUND_LIGHT;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', Utility.BACKGROUND_LIGHT);
    }

    this.state = {
      data: data,
      schedule: {
        schedule: {},
        bookmarks: [],
      },
      switches: defaultSwitches,
      f,
      f2,
      sf,
      loadingLogin: false,
      unsavedChanges: false,
      originalDataString: '',
      scheduleInteractions: {
        hoverSection: {
          set: (id) => this.interactionUpdate('hoverSection', id),
          clear: () => this.interactionUpdate('hoverSection'),
        },
        hoverDelete: {
          set: (id) => this.interactionUpdate('hoverDelete', id),
          clear: () => this.interactionUpdate('hoverDelete'),
        },
        previewSection: {
          set: (id) => this.interactionUpdate('previewSection', id),
          clear: () => this.interactionUpdate('previewSection'),
        },
        multiClear: (interactions) => this.interactionMultiClear(interactions),
      },
    };
  }

  componentDidMount() {
    this.setState({ loadingLogin: true });
    let params = new URLSearchParams(window.location.search);

    let code = params.get('code');
    params.delete('code');
    let state = params.get('state');
    params.delete('state');
    let action = params.get('action');
    params.delete('action');

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    );

    if (action) {
      switch (action) {
        case 'login':
          toast.success('Logged in');
          break;
        case 'logout':
          toast.success('Logged out', {
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          });
          break;
        case 'plan':
          this.setSwitch('mode', Mode.PLAN);
          break;
        case 'schedule':
          this.setSwitch('mode', Mode.SCHEDULE);
          break;
      }
    }

    if (code && state) {
      d('query has code and state, logging in');
      Account.logIn(code, state).then((response) => {
        if (!response.success) {
          this.showAlert(
            Utility.errorAlert(
              'account_initial_login_code',
              response.data as string
            )
          );
        } else {
          this.setSwitch('tab', 'Plans');
          this.setSwitch('active_plan_id', 'None', true);
        }
        this.initialize(params, () => {
          this.setState({ loadingLogin: false });
        });
      });
    } else {
      this.initialize(params, () => {
        this.setState({ loadingLogin: false });
      });
    }
  }

  initialize(params: URLSearchParams, callback: () => void) {
    d('initializing');
    SaveDataManager.load(params, this.state.switches)
      .then(({ mode, data, activeId, originalDataString, method }) => {
        const modeStr = mode === Mode.PLAN ? 'plan' : 'schedule';
        if (data === 'malformed') {
          this.showAlert({
            title: `Unable to load ${modeStr}.`,
            message: `The ${modeStr} you're trying to access is not valid. If you're loading it through a URL, ensure that it hasn't been manually modified.`,
            confirmButton: 'What a shame.',
            confirmButtonColor: 'red',
            iconColor: 'red',
            icon: ExclamationIcon,
          });
          return;
        }
        this.setSwitch('mode', mode);
        this.setSwitch(
          mode === Mode.PLAN ? 'active_plan_id' : 'active_schedule_id',
          activeId,
          true
        );
        this.setState({ originalDataString });
        if (data === 'empty') {
          return;
        }

        switch (mode) {
          case Mode.PLAN:
            this.setState({ data: data as PlanData });
            break;
          case Mode.SCHEDULE:
            this.setState({ schedule: data as ScheduleData });
            break;
        }

        switch (method) {
          case 'URL':
            toast.success(`Loaded ${modeStr} from URL`);
            break;
          case 'Account':
            toast.success(
              `Loaded ${modeStr}: ` +
                (mode === Mode.PLAN
                  ? Account.getPlanName(activeId)
                  : Account.getScheduleName(activeId))
            );
            break;
          case 'Storage':
            toast.success(`Loaded recently edited ${modeStr}`);
            break;
        }
      })
      .catch((error: PlanError) => {
        this.showAlert(
          Utility.errorAlert('account_initial_login', error.message)
        );
      })
      .finally(() => {
        callback();
        d('initialization complete');
      });
  }

  componentDidUpdate(_: Readonly<{}>, prevState: Readonly<AppState>) {
    if (prevState.unsavedChanges !== this.state.unsavedChanges) {
      if (this.state.unsavedChanges) {
        d('there are now unsaved changes');
        window.onbeforeunload = () => {
          return true;
        };
      } else {
        d('there are no longer unsaved changes');
        window.onbeforeunload = null;
      }
    }
  }

  setSwitch(key: keyof ReadUserOptions, val: any, save = false) {
    let switches = this.state.switches;
    if (
      key === 'active_plan_id' &&
      val === 'None' &&
      switches.get[key] !== val
    ) {
      this.setState({ unsavedChanges: false });
    }
    switches.get[key] = val;
    this.setState({ switches: switches });
    if (save) {
      SaveDataManager.saveSwitchToStorage(key, val?.toString());
    }
    d('switch set: %s = %s', key, val);
  }

  showAlert(alertData: AlertData) {
    this.setState({ alertData });
  }

  postShowAlert() {
    this.setState({ alertData: undefined });
  }

  activateAccountPlan(planId: string) {
    d('plan activating: %s', planId);
    Account.getPlans()
      .then((plans) => {
        if (!plans) {
          this.showAlert(
            Utility.errorAlert('account_activate_plan', 'Undefined Plans')
          );
          return;
        }
        let plan = plans[planId];
        if (!plan) {
          this.showAlert(
            Utility.errorAlert('account_activate_plan', 'Undefined Plan')
          );
          return;
        }
        let data = PlanManager.loadFromString(plan.content);
        if (data === 'malformed') {
          this.showAlert(
            Utility.errorAlert('account_activate_plan', 'Malformed Plan')
          );
          return;
        }

        if (data === 'empty') {
          this.setSwitch('active_plan_id', planId, true);
          this.setState({
            originalDataString: plan.content,
            unsavedChanges: window.location.search.length > 0,
          });
          toast.success('Activated plan: ' + Account.getPlanName(planId));
          d('plan activated: %s (empty)', planId);
          return;
        }

        let confirmNonAccountOverwrite =
          this.state.switches.get.active_plan_id === 'None' &&
          window.location.search.length > 0;

        this.discardChanges(() => {
          this.setSwitch('active_plan_id', planId, true);
          this.setState(
            {
              data: data as PlanData,
              originalDataString: plan.content,
            },
            () => {
              PlanManager.save(data as PlanData);
              toast.success('Activated plan: ' + Account.getPlanName(planId));
              d('plan activated: %s', planId);
            }
          );
        }, confirmNonAccountOverwrite);
      })
      .catch((error: PlanError) => {
        this.showAlert(
          Utility.errorAlert('account_activate_plan', error.message)
        );
      });
  }

  deactivatePlan() {
    this.discardChanges(() => {
      let planId = this.state.switches.get.active_plan_id;
      this.setSwitch('active_plan_id', 'None', true);
      toast.success('Deactivated plan', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
      d('plan deactivated: %s', planId);
    });
  }

  updatePlan() {
    let activePlanId = this.state.switches.get.active_plan_id;
    if (!activePlanId || activePlanId === 'None') {
      this.showAlert(
        Utility.errorAlert('account_update_plan', 'No Active Plan')
      );
      return;
    }

    const dataStr = PlanManager.getDataString(this.state.data);
    this.setState({ unsavedChanges: false });

    let self = this;
    toast.promise(Account.updatePlan(activePlanId as string, dataStr), {
      loading: 'Saving...',
      success: () => {
        self.setState({
          originalDataString: dataStr,
        });
        return 'Saved ' + Account.getPlanName(activePlanId as string);
      },
      error: (err) => {
        this.setState({ unsavedChanges: true });
        this.showAlert(Utility.errorAlert('account_update_plan', err.message));
        return 'Something went wrong';
      },
    });
  }

  discardChanges(
    action: () => void,
    confirmNonAccountOverwrite: boolean = false
  ) {
    let message = confirmNonAccountOverwrite
      ? 'It looks like you have some data on your plan already. Activating this non-empty plan will overwrite that data. Are you sure?'
      : 'It looks like you have some unsaved changes. Navigating away will cause them not to be saved to your account. Are you sure?';

    if (confirmNonAccountOverwrite || this.state.unsavedChanges) {
      this.showAlert({
        title: 'Hold on...',
        message,
        confirmButton: 'Yes, continue',
        confirmButtonColor: 'red',
        cancelButton: 'Go back',
        iconColor: 'red',
        icon: ExclamationIcon,
        action: () => {
          this.setState({ unsavedChanges: false });
          action();
        },
      });
      return;
    }

    action();
  }

  interactionUpdate(interaction: keyof ScheduleInteractions, value?: any) {
    this.setState({
      scheduleInteractions: {
        ...this.state.scheduleInteractions,
        [interaction]: {
          ...this.state.scheduleInteractions[interaction],
          get: value,
        },
      },
    });
  }

  interactionMultiClear(interactions: (keyof ScheduleInteractions)[]) {
    let scheduleInteractions = this.state.scheduleInteractions;
    for (let interaction of interactions) {
      if (interaction === 'multiClear') continue;
      delete scheduleInteractions[interaction].get;
    }
    this.setState({ scheduleInteractions });
  }

  render() {
    let switches = this.state.switches;
    let tab = switches.get.tab;
    let darkMode = switches.get.dark;
    return (
      <DndProvider backend={HTML5Backend}>
        {switches.get.notifications && (
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                minWidth: '12rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: darkMode ? '#262626' : undefined,
                color: darkMode ? '#ffffff' : undefined,
              },
            }}
          />
        )}
        <MotionConfig
          reducedMotion={switches.get.reduced_motion ? 'always' : 'never'}
        >
          <div className={`${darkMode ? 'dark' : ''} relative`}>
            {this.state.alertData && (
              <Alert
                data={this.state.alertData}
                switches={switches}
                onConfirm={(inputText?: string) => {
                  let alertData = this.state.alertData;
                  if (alertData?.action) {
                    alertData.action(inputText);
                  }
                }}
                onClose={() => {
                  this.postShowAlert();
                }}
              />
            )}

            <div className="bg-white dark:bg-gray-800 grid grid-cols-1 lg:grid-cols-8">
              <div className="col-span-2 px-4 h-192 md:h-screen flex flex-col">
                <Info mode={switches.get.mode as number} />
                <Search
                  data={this.state.data}
                  schedule={this.state.schedule}
                  switches={switches}
                  f={this.state.f}
                  sf={this.state.sf}
                  scheduleInteractions={this.state.scheduleInteractions}
                />
                {tab === 'My List' && (
                  <Bookmarks
                    bookmarks={this.state.data.bookmarks}
                    schedule={this.state.schedule}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    f={this.state.f}
                    sf={this.state.sf}
                    scheduleInteractions={this.state.scheduleInteractions}
                    switches={switches}
                  />
                )}
                {tab === 'Plans' && (
                  <AccountPlans
                    data={this.state.data}
                    switches={this.state.switches}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    activatePlan={(planId) => {
                      this.activateAccountPlan(planId);
                    }}
                    deactivatePlan={() => {
                      this.deactivatePlan();
                    }}
                    activePlanId={switches.get.active_plan_id as string}
                  />
                )}
                <TaskBar
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  version={VERSION}
                  switches={switches}
                  f2={this.state.f2}
                  tabLoading={this.state.loadingLogin}
                />
              </div>

              <div
                className={`${
                  switches.get.compact ? 'compact-mode ' : ''
                } col-span-6 block pt-0 lg:h-screen lg:overflow-y-scroll no-scrollbar`}
              >
                {switches.get.mode === Mode.PLAN ? (
                  <Content
                    data={this.state.data}
                    f={this.state.f}
                    f2={this.state.f2}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    switches={switches}
                  />
                ) : (
                  <Schedule
                    schedule={this.state.schedule}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    interactions={this.state.scheduleInteractions}
                    sf={this.state.sf}
                    switches={switches}
                  />
                )}
              </div>
            </div>
            <AnimatePresence>
              {this.state.unsavedChanges && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className={`fixed right-12 ${
                    switches.get.save_location_top ? 'top-8' : 'bottom-8'
                  }`}
                >
                  <button
                    className="flex items-center gap-2 rainbow-border-button shadow-lg opacity-75 hover:opacity-100 active:before:bg-none active:before:bg-emerald-400
                                            after:bg-gray-100 text-black dark:after:bg-gray-700 dark:text-white"
                    onClick={() => {
                      this.updatePlan();
                    }}
                  >
                    <>
                      <SaveIcon className="h-6 w-6 inline-block" />
                      <p className="inline-block text-lg font-extrabold">
                        SAVE
                      </p>
                    </>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MotionConfig>
      </DndProvider>
    );
  }
}

export default App;
