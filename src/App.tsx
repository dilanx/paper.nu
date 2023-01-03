import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import debug from 'debug';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import Account from './Account';
import {
  activateAccountPlan,
  activateAccountSchedule,
  deactivate,
  discardChanges,
  update,
} from './app/AccountModification';
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
import ModeSwitch from './components/menu/ModeSwitch';
import SideCard from './components/menu/side-card/SideCard';
import TaskBar from './components/menu/TaskBar';
import Content from './components/plan/Content';
import CampusMap from './components/map/CampusMap';
import Schedule from './components/schedule/Schedule';
import Search from './components/search/Search';
import SaveDataManager from './SaveDataManager';
import { AlertData } from './types/AlertTypes';
import { AppType, AppState, ReadUserOptions } from './types/BaseTypes';
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
import { SearchModificationFunctions } from './types/SearchTypes';
import { SideCardData } from './types/SideCardTypes';
import { Mode } from './utility/Constants';
import PlanError from './utility/PlanError';
import Utility from './utility/Utility';
import About from './components/menu/about/About';
import { getTermName } from './DataManager';
import ChangeLogPreview from './components/menu/ChangeLogPreview';
import clp from './app/ChangeLogPreview';
var d = debug('app');

const VERSION = process.env.REACT_APP_VERSION ?? '0.0.0';
const VERSION_NO_PATCH = VERSION.split('.').slice(0, 2).join('.');

class App extends React.Component<{}, AppState> implements AppType {
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

    const ff: SearchModificationFunctions = {
      set: (query, current) => {
        this.setState({
          searchDefaults: {
            query,
            scheduleCurrent: current,
            updated: !this.state.searchDefaults?.updated,
          },
        });
      },
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

    const lastVersion = localStorage.getItem('v');

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
      ff,
      clp: !lastVersion || lastVersion !== VERSION_NO_PATCH,
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

  initialize(params: URLSearchParams | undefined, callback: () => void) {
    d('initializing');
    SaveDataManager.load(params, this.state.switches)
      .then(
        ({
          mode,
          data,
          activeId,
          originalDataString,
          method,
          latestTermId,
        }) => {
          const modeStr = mode === Mode.PLAN ? 'plan' : 'schedule';
          if (data === 'malformed') {
            this.setState({
              schedule: {
                termId: latestTermId,
                ...this.state.schedule,
              },
              latestTermId,
            });
            this.showAlert({
              title: `Unable to load ${modeStr}.`,
              message: `The ${modeStr} you're trying to access is not valid. If you're loading it through a URL, ensure that it hasn't been manually modified.`,
              confirmButton: 'What a shame.',
              color: 'red',
              icon: ExclamationTriangleIcon,
            });
            return;
          }
          this.setSwitch('mode', mode);
          this.setSwitch(
            mode === Mode.PLAN ? 'active_plan_id' : 'active_schedule_id',
            activeId,
            true
          );
          this.setState({
            originalDataString,
            unsavedChanges: false,
            latestTermId,
          });
          if (data === 'empty') {
            this.setState({
              schedule: {
                termId: latestTermId,
                ...this.state.schedule,
              },
            });
            return;
          }

          switch (mode) {
            case Mode.PLAN:
              this.setState({
                data: data as PlanData,
                schedule: { termId: latestTermId, ...this.state.schedule },
              });
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
            case 'TermChange':
              const sdata = data as ScheduleData;
              toast.success(
                `Changed term to ${
                  sdata.termId
                    ? getTermName(sdata.termId) || 'unknown'
                    : 'unknown'
                }`
              );
              break;
          }
        }
      )
      .catch((error: PlanError) => {
        this.showAlert(Utility.errorAlert('initialization', error.message));
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

  showSideCard(sideCardData: SideCardData) {
    this.setState({ sideCardData });
  }

  closeSideCard() {
    this.setState({ sideCardData: undefined });
  }

  postShowAlert() {
    this.setState({ alertData: undefined });
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
    const switches = this.state.switches;
    const tab = switches.get.tab;
    const darkMode = switches.get.dark;
    const isSchedule = switches.get.mode === Mode.SCHEDULE;

    return (
      <DndProvider backend={HTML5Backend}>
        {switches.get.notifications && (
          <Toaster
            containerClassName={`${darkMode ? 'dark' : ''}`}
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

            {this.state.about && (
              <About
                switches={switches}
                onClose={() => this.setState({ about: false })}
              />
            )}

            {this.state.clp && clp.items.length > 0 && (
              <ChangeLogPreview
                version={VERSION_NO_PATCH}
                info={clp}
                switches={switches}
                onClose={() => {
                  localStorage.setItem('v', VERSION_NO_PATCH);
                  this.setState({ clp: false });
                }}
              />
            )}

            {this.state.map && (
              <CampusMap
                schedule={this.state.schedule.schedule}
                switches={switches}
                onClose={() => {
                  this.setState({ map: false });
                }}
              />
            )}
            <AnimatePresence>
              {this.state.sideCardData && (
                <SideCard
                  data={this.state.sideCardData}
                  switches={switches}
                  onClose={() => this.closeSideCard()}
                />
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 bg-white dark:bg-gray-800 lg:grid-cols-8">
              <div className="col-span-2 flex h-192 flex-col px-4 md:h-screen">
                <Info dark={darkMode} />
                <ModeSwitch
                  switches={switches}
                  changeMode={(mode) => {
                    this.closeSideCard();
                    discardChanges(this, () => {
                      this.setSwitch('mode', mode, true);
                      this.setState({ loadingLogin: true });
                      this.initialize(undefined, () => {
                        this.setState({ loadingLogin: false });
                      });
                    });
                  }}
                />
                <Search
                  data={this.state.data}
                  schedule={this.state.schedule}
                  switches={switches}
                  f={this.state.f}
                  sf={this.state.sf}
                  scheduleInteractions={this.state.scheduleInteractions}
                  sideCard={(sideCardData) => {
                    this.showSideCard(sideCardData);
                  }}
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  defaults={this.state.searchDefaults}
                  expandMap={() => this.setState({ map: true })}
                  loading={this.state.loadingLogin}
                  term={
                    this.state.schedule.termId
                      ? {
                          id: this.state.schedule.termId,
                          name:
                            getTermName(this.state.schedule.termId) ||
                            'unknown',
                        }
                      : undefined
                  }
                  switchTerm={(termId) => {
                    this.closeSideCard();
                    this.setState({ loadingLogin: true });
                    this.initialize(
                      new URLSearchParams({
                        t: termId,
                      }),
                      () => {
                        this.setState({ loadingLogin: false });
                      }
                    );
                  }}
                  latestTermId={this.state.latestTermId}
                />
                {tab === 'My List' && (
                  <Bookmarks
                    bookmarks={this.state.data.bookmarks}
                    schedule={this.state.schedule}
                    sideCard={(sideCardData) => {
                      this.showSideCard(sideCardData);
                    }}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    f={this.state.f}
                    sf={this.state.sf}
                    scheduleInteractions={this.state.scheduleInteractions}
                    switches={switches}
                    loading={this.state.loadingLogin}
                  />
                )}
                {tab === 'Plans' && (
                  <AccountPlans
                    switches={this.state.switches}
                    alert={(alertData) => {
                      this.showAlert(alertData);
                    }}
                    activatePlan={(id) => {
                      activateAccountPlan(this, id);
                    }}
                    activateSchedule={(id) => {
                      activateAccountSchedule(this, id);
                    }}
                    deactivate={() => {
                      deactivate(this, isSchedule);
                    }}
                    activeId={
                      switches.get[
                        `active_${isSchedule ? 'schedule' : 'plan'}_id`
                      ]
                    }
                    loading={this.state.loadingLogin}
                  />
                )}
                <TaskBar
                  openAboutMenu={() => this.setState({ about: true })}
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  version={VERSION}
                  switches={switches}
                  f2={this.state.f2}
                />
              </div>

              <div
                className={`${
                  switches.get.compact ? 'compact-mode ' : ''
                } no-scrollbar col-span-6 block pt-0 lg:h-screen lg:overflow-y-scroll`}
              >
                <AnimatePresence mode="wait">
                  {switches.get.mode === Mode.PLAN ? (
                    <Content
                      data={this.state.data}
                      f={this.state.f}
                      f2={this.state.f2}
                      alert={(alertData) => {
                        this.showAlert(alertData);
                      }}
                      sideCard={(sideCardData) => {
                        this.showSideCard(sideCardData);
                      }}
                      switches={switches}
                      key="plan"
                    />
                  ) : (
                    <Schedule
                      schedule={this.state.schedule}
                      alert={(alertData) => {
                        this.showAlert(alertData);
                      }}
                      sideCard={(sideCardData) => {
                        this.showSideCard(sideCardData);
                      }}
                      interactions={this.state.scheduleInteractions}
                      sf={this.state.sf}
                      ff={this.state.ff}
                      switches={switches}
                      openMap={() => {
                        this.setState({ map: true });
                      }}
                      key="schedule"
                    />
                  )}
                </AnimatePresence>
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
                    className="rainbow-border-button flex items-center gap-2 text-black opacity-75 shadow-lg after:bg-gray-100 hover:opacity-100
                      active:before:bg-emerald-400 active:before:bg-none dark:text-white dark:after:bg-gray-700"
                    onClick={() => {
                      update(this, isSchedule);
                    }}
                  >
                    <>
                      <ArrowDownTrayIcon className="inline-block h-6 w-6" />
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
