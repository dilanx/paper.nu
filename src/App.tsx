import {
  ExclamationIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import debug from 'debug';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import Account from './Account';
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
import ScheduleManager from './ScheduleManager';
import { AlertData } from './types/AlertTypes';
import { UserOptions, UserOptionValue } from './types/BaseTypes';
import {
  Course,
  CourseLocation,
  PlanData,
  PlanModificationFunctions,
  PlanSpecialFunctions,
} from './types/PlanTypes';
import {
  ScheduleCourse,
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from './types/ScheduleTypes';
import { Mode } from './utility/Constants';
import PlanError from './utility/PlanError';
import Utility from './utility/Utility';
var d = debug('main');

const VERSION = process.env.REACT_APP_VERSION ?? 'UNKNOWN';

interface AppState {
  data: PlanData;
  schedule: ScheduleData;
  switches: UserOptions;
  alertData?: AlertData;
  f: PlanModificationFunctions;
  f2: PlanSpecialFunctions;
  sf: ScheduleModificationFunctions;
  loadingLogin: boolean;
  unsavedChanges: boolean;
  originalDataString: string;
  scheduleInteractions: ScheduleInteractions;
}

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
        app.addCourse(course, location);
      },
      removeCourse: (courseIndex, location) => {
        app.removeCourse(courseIndex, location);
      },
      moveCourse: (course, oldLocation, newLocation) => {
        app.moveCourse(course, oldLocation, newLocation);
      },
      addBookmark: (course, forCredit) => {
        app.addBookmark(course, forCredit);
      },
      removeBookmark: (course, forCredit) => {
        app.removeBookmark(course, forCredit);
      },
    };

    const f2: PlanSpecialFunctions = {
      addSummerQuarter: (year) => {
        app.addSummerQuarter(year);
      },
      addYear: () => {
        app.addYear();
      },
      clearData: (year?: number) => {
        app.clearData(year);
      },
    };

    const sf: ScheduleModificationFunctions = {
      addSection: (section) => app.addSection(section),
      removeSection: (section) => app.removeSection(section),
      addScheduleBookmark: (course) => app.addScheduleBookmark(course),
      removeScheduleBookmark: (course) => app.removeScheduleBookmark(course),
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

  setSwitch(key: string, val: UserOptionValue, save = false) {
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

  courseConfirmationPrompts(
    course: Course,
    { year, quarter }: CourseLocation,
    confirmationCallback: () => void,
    ignoreExistCheck = false
  ) {
    let data = this.state.data;
    let isPlaceholder = course.placeholder;
    let repeatable = course.repeatable;

    let exists = PlanManager.duplicateCourse(course, data);

    if (!repeatable && exists && !isPlaceholder && !ignoreExistCheck) {
      this.showAlert({
        title: 'Course already planned.',
        message: `You already have ${
          course.id
        } on your plan during the ${Utility.convertQuarter(
          exists.quarter
        ).title.toLowerCase()} quarter of your ${Utility.convertYear(
          exists.year
        ).toLowerCase()} year.`,
        cancelButton: 'Go back',
        confirmButton: 'Add anyway',
        confirmButtonColor: 'red',
        iconColor: 'red',
        icon: ExclamationIcon,
        action: () => {
          confirmationCallback();
        },
      });
      return;
    }

    let unitCount =
      PlanManager.getQuarterCredits(data.courses[year][quarter]) +
      parseFloat(course.units);

    if (unitCount > 5.5) {
      this.showAlert({
        title: 'Too many classes.',
        message: `With this course, you'll have ${unitCount} units worth of classes this quarter, which is over Northwestern's maximum of 5.5 units.`,
        cancelButton: 'Go back',
        confirmButton: 'Add anyway',
        confirmButtonColor: 'red',
        iconColor: 'red',
        icon: ExclamationIcon,
        action: () => {
          confirmationCallback();
        },
      });
      return;
    }

    confirmationCallback();
  }

  addCourse(course: Course, location: CourseLocation) {
    this.courseConfirmationPrompts(course, location, () => {
      let data = this.state.data;
      let { year, quarter } = location;
      data.courses[year][quarter].push(course);
      data.courses[year][quarter].sort((a, b) => {
        if (a.placeholder) return 1;
        if (b.placeholder) return -1;
        return a.id.localeCompare(b.id);
      });

      d('course added: %s (y%dq%d)', course.id, year, quarter);
      this.setState({
        data,
        unsavedChanges: PlanManager.save(
          data,
          this.state.switches,
          this.state.originalDataString
        ),
      });
    });
  }

  removeCourse(course: Course, { year, quarter }: CourseLocation) {
    if (year < 0) {
      this.removeBookmark(course, quarter === 1);
      return;
    }
    let data = this.state.data;
    data.courses[year][quarter].splice(
      data.courses[year][quarter].indexOf(course),
      1
    );
    d('course removed: %s (y%dq%d)', course.id, year, quarter);
    this.setState({
      data,
      unsavedChanges: PlanManager.save(
        data,
        this.state.switches,
        this.state.originalDataString
      ),
    });
  }

  moveCourse(
    course: Course,
    oldLocation: CourseLocation,
    newLocation: CourseLocation
  ) {
    let { year: oy, quarter: oq } = oldLocation;
    let { year: ny, quarter: nq } = newLocation;
    if (oy === ny && oq === nq) return;

    this.courseConfirmationPrompts(
      course,
      newLocation,
      () => {
        if (oy >= 0) {
          let data = this.state.data;
          data.courses[oy][oq].splice(data.courses[oy][oq].indexOf(course), 1);
        }
        let data = this.state.data;
        data.courses[ny][nq].push(course);
        data.courses[ny][nq].sort((a, b) => {
          if (a.placeholder) return 1;
          if (b.placeholder) return -1;
          return a.id.localeCompare(b.id);
        });

        d('course moved: %s (y%dq%d) -> (y%dq%d)', course.id, oy, oq, ny, nq);
        this.setState({
          data,
          unsavedChanges: PlanManager.save(
            data,
            this.state.switches,
            this.state.originalDataString
          ),
        });
      },
      true
    );
  }

  addBookmark(course: Course, forCredit: boolean) {
    let bookmarks = this.state.data.bookmarks;
    if (forCredit) {
      bookmarks.forCredit.add(course);
    } else {
      bookmarks.noCredit.add(course);
    }

    d('bookmark added: %s (credit = %s)', course.id, forCredit.toString());
    this.setState((prevState) => {
      const data = {
        ...prevState.data,
        bookmarks: bookmarks,
      };
      return {
        data,
        unsavedChanges: PlanManager.save(
          data,
          this.state.switches,
          prevState.originalDataString
        ),
      };
    });
  }

  removeBookmark(course: Course, forCredit: boolean) {
    let bookmarks = this.state.data.bookmarks;
    if (forCredit) {
      bookmarks.forCredit.delete(course);
    } else {
      bookmarks.noCredit.delete(course);
    }

    d('bookmark removed: %s (credit = %s)', course.id, forCredit.toString());
    this.setState((prevState) => {
      const data = {
        ...prevState.data,
        bookmarks: bookmarks,
      };
      return {
        data,
        unsavedChanges: PlanManager.save(
          data,
          prevState.switches,
          prevState.originalDataString
        ),
      };
    });
  }

  addSummerQuarter(year: number) {
    this.showAlert({
      title: 'Add summer quarter to this year?',
      message: `This will add a summer quarter to your ${Utility.convertYear(
        year
      ).toLowerCase()}. You can remove it by removing all classes from that quarter and refreshing the page.`,
      confirmButton: 'Add quarter',
      confirmButtonColor: 'yellow',
      cancelButton: 'Close',
      iconColor: 'yellow',
      icon: PlusIcon,
      action: () => {
        let data = this.state.data;
        data.courses[year].push([]);
        this.setState({ data: data });
        d('summer quarter added: y%d', year);
      },
    });
  }

  addYear() {
    let data = this.state.data;
    data.courses.push([[], [], []]);
    this.setState({ data: data });
    d('year added: y%d', data.courses.length);
  }

  clearData(year?: number) {
    let data;
    if (year === undefined) {
      data = {
        courses: [
          [[], [], []],
          [[], [], []],
          [[], [], []],
          [[], [], []],
        ],
        bookmarks: {
          forCredit: new Set<Course>(),
          noCredit: new Set<Course>(),
        },
      };
      d('plan cleared');
      this.setState({
        data,
        unsavedChanges: PlanManager.save(
          data,
          this.state.switches,
          this.state.originalDataString
        ),
      });
    } else {
      const yearText = Utility.convertYear(year).toLowerCase();
      this.showAlert({
        title: 'Clear this year?',
        message: `All of the courses in your ${yearText} will be removed.`,
        cancelButton: 'Cancel',
        confirmButton: 'Clear',
        confirmButtonColor: 'red',
        iconColor: 'red',
        icon: TrashIcon,
        action: () => {
          let oldData = this.state.data;
          let courses = this.state.data.courses;
          courses[year] = [[], [], []];
          data = { courses: courses, bookmarks: oldData.bookmarks };
          d('year cleared: y%d', year);
          toast.success(`Cleared your ${yearText}`, {
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          });
          this.setState({
            data,
            unsavedChanges: PlanManager.save(
              data,
              this.state.switches,
              this.state.originalDataString
            ),
          });
        },
      });
    }
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

  addSection(section: ScheduleSection) {
    delete section.preview;
    let schedule = this.state.schedule;
    schedule.schedule[section.section_id] = section;

    d('schedule section added: %s', section.section_id);
    this.setState({
      schedule,
      unsavedChanges: ScheduleManager.save(schedule, this.state.switches),
    });
  }

  removeSection(section: ScheduleSection) {
    let schedule = this.state.schedule;
    delete schedule.schedule[section.section_id];
    d('schedule section removed: %s', section.section_id);
    this.setState({
      schedule,
      unsavedChanges: ScheduleManager.save(schedule, this.state.switches),
    });
  }

  addScheduleBookmark(course: ScheduleCourse) {
    let schedule = this.state.schedule;
    if (
      schedule.bookmarks.some(
        (bookmarkCourse) => bookmarkCourse.course_id === course.course_id
      )
    ) {
      return;
    }
    schedule.bookmarks.push(course);
    this.setState({
      schedule,
      unsavedChanges: ScheduleManager.save(schedule, this.state.switches),
    });
  }

  removeScheduleBookmark(course: ScheduleCourse) {
    let schedule = this.state.schedule;
    if (
      !schedule.bookmarks.some(
        (bookmarkCourse) => bookmarkCourse.course_id === course.course_id
      )
    ) {
      return;
    }

    let index = -1;
    for (let i = 0; i < schedule.bookmarks.length; i++) {
      if (schedule.bookmarks[i].course_id === course.course_id) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return;
    }

    schedule.bookmarks.splice(index, 1);

    this.setState({
      schedule,
      unsavedChanges: ScheduleManager.save(schedule, this.state.switches),
    });
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
