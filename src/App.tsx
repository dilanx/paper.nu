import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import Account from './Account';
import { getTermName } from './DataManager';
import SaveDataManager from './SaveDataManager';
import {
  activateAccountPlan,
  activateAccountSchedule,
  deactivate,
  discardChanges,
  discardNotesChanges,
  update,
} from './app/AccountModification';
import bn from './app/BannerNotice';
import clp from './app/ChangeLogPreview';
import {
  addBookmark,
  addCourse,
  addSummerQuarter,
  addYear,
  clearData,
  moveCourse,
  putCustomCourse,
  removeBookmark,
  removeCourse,
  removeSummerQuarter,
  removeYear,
} from './app/PlanModification';
import {
  addScheduleBookmark,
  addSection,
  clearSchedule,
  putCustomSection,
  removeScheduleBookmark,
  removeSection,
} from './app/ScheduleModification';
import AccountPlans from './components/account/AccountPlans';
import Bookmarks from './components/bookmarks/Bookmarks';
import CampusMap from './components/map/CampusMap';
import BannerNotice from './components/menu/BannerNotice';
import ChangeLogPreview from './components/menu/ChangeLogPreview';
import Info from './components/menu/Info';
import ModeSwitch from './components/menu/ModeSwitch';
import Notes from './components/menu/Notes';
import Taskbar from './components/menu/Taskbar';
import About from './components/menu/about/About';
import Alert from './components/menu/alert/Alert';
import ContextMenu from './components/menu/context-menu/ContextMenu';
import SideCard from './components/menu/side-card/SideCard';
import Toolbar from './components/menu/toolbar/Toolbar';
import Content from './components/plan/Content';
import Schedule from './components/schedule/Schedule';
import Search from './components/search/Search';
import { AlertData } from './types/AlertTypes';
import {
  AppState,
  AppType,
  ContextMenuData,
  ReadUserOptions,
  SaveDataOptions,
} from './types/BaseTypes';
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
import { openInfo as planOpenInfo } from './utility/CourseInfo';
import { PaperError } from './utility/PaperError';
import { openInfo as scheduleOpenInfo } from './utility/ScheduleSectionInfo';
import Utility from './utility/Utility';
import {
  activateRecentShare,
  getRecentShare,
  removeRecentShareHistory,
  updateRecentShare,
} from './app/RecentShare';
import { RecentShareModificationFunctions } from './types/AccountTypes';
const d = debug('app');

const VERSION = process.env.REACT_APP_VERSION ?? '0.0.0';
const VERSION_NO_PATCH = VERSION.split('.').slice(0, 2).join('.');

class App extends React.Component<{}, AppState> implements AppType {
  appRef;

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
      putCustomCourse: (location, courseToEdit) =>
        putCustomCourse(app, location, courseToEdit),
    };

    const f2: PlanSpecialFunctions = {
      addSummerQuarter: (year) => {
        addSummerQuarter(app, year);
      },
      removeSummerQuarter: (year) => {
        removeSummerQuarter(app, year);
      },
      addYear: () => {
        addYear(app);
      },
      removeYear: (year) => {
        removeYear(app, year);
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
      putCustomSection: (sectionToEdit) => putCustomSection(app, sectionToEdit),
      clear: () => clearSchedule(app),
    };

    const ff: SearchModificationFunctions = {
      set: (query, current) => {
        this.setSwitch('tab', 'Search');
        this.setState({
          searchDefaults: {
            query,
            scheduleCurrent: current,
            updated: !this.state.searchDefaults?.updated,
          },
        });
      },
    };

    const rf: RecentShareModificationFunctions = {
      open: (shortCode) => activateRecentShare(app, shortCode),
      remove: (shortCode) => removeRecentShareHistory(app, shortCode),
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
    const bannerNoticeId = localStorage.getItem('bn_id');

    this.appRef = React.createRef<HTMLDivElement>();
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
      rf,
      clp: !lastVersion || lastVersion !== VERSION_NO_PATCH,
      banner: !!bn && (!bannerNoticeId || bannerNoticeId !== bn.id),
      loadingLogin: false,
      saveState: 'idle',
      scheduleInteractions: {
        hoverSection: {
          set: (id) => this.interactionUpdate('hoverSection', id),
          clear: () => this.interactionUpdate('hoverSection'),
        },
        hoverDelete: {
          set: (id) => this.interactionUpdate('hoverDelete', id),
          clear: () => this.interactionUpdate('hoverDelete'),
        },
        hoverLocation: {
          set: (location) => this.interactionUpdate('hoverLocation', location),
          clear: () => this.interactionUpdate('hoverLocation'),
        },
        previewSection: {
          set: (id) => this.interactionUpdate('previewSection', id),
          clear: () => this.interactionUpdate('previewSection'),
        },
        multiClear: (interactions) => this.interactionMultiClear(interactions),
      },
      recentShare: getRecentShare(),
    };
  }

  componentDidMount() {
    this.setState({ loadingLogin: true });
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    const code = params.get('code');
    const state = params.get('state');
    const action = params.get('action');
    const search = params.get('fs');
    const showCourse = params.get('c');
    const showSection = params.get('s');

    window.history.replaceState({}, '', window.location.pathname);

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

    if (search) {
      this.state.ff.set(search);
    }

    if (code && state) {
      d('query has code and state, logging in');
      Account.logIn(code, state).then((response) => {
        if (!response.success) {
          this.showAlert(
            Utility.errorAlert(
              'account_initial_login_code',
              new PaperError(response.data as string)
            )
          );
        } else {
          this.setSwitch('tab', 'Plans');
          this.setSwitch('active_plan_id', 'None', true);
        }
        this.initialize(
          () => {
            this.setState({ loadingLogin: false });
          },
          { hash, showCourse, showSection }
        );
      });
    } else {
      this.initialize(
        () => {
          this.setState({ loadingLogin: false });
        },
        { hash, showCourse, showSection }
      );
    }
  }

  initialize(callback: () => void, options?: SaveDataOptions) {
    d('initializing');
    SaveDataManager.load(this.state.switches, options)
      .then(
        ({
          mode,
          data,
          activeId,
          method,
          error,
          latestTermId,
          sharedCourse,
          sharedSection,
          recentShare,
        }) => {
          const modeStr = mode === Mode.PLAN ? 'plan' : 'schedule';

          if (sharedCourse) {
            planOpenInfo((data) => this.showSideCard(data), sharedCourse);
          }

          if (sharedSection) {
            scheduleOpenInfo(
              (data) => this.showSideCard(data),
              (data) => this.showAlert(data),
              sharedSection,
              undefined,
              {
                ff: this.state.ff,
              }
            );
          }

          if (recentShare) {
            if (typeof recentShare === 'string') {
              this.setState({
                recentShare: updateRecentShare(recentShare),
              });
            } else {
              this.setState({
                recentShare: updateRecentShare(
                  recentShare.shortCode,
                  recentShare
                ),
              });
              mode = recentShare.type === 1 ? Mode.PLAN : Mode.SCHEDULE;
            }
          }

          if (data === 'malformed') {
            this.setState({
              schedule: {
                termId: latestTermId,
                ...this.state.schedule,
              },
              latestTermId,
            });
            this.showAlert({
              title: `Nothing to load.`,
              message:
                error ||
                `Something problematic happened when trying to load stuff.`,
              cancelButton: 'Close',
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
            saveState: 'idle',
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
              toast.success(
                `Loaded shared ${modeStr}${
                  recentShare && typeof recentShare !== 'string'
                    ? `: ${recentShare.name}`
                    : ''
                }`
              );
              break;
            case 'Account':
              toast.success(
                `Loaded ${modeStr}: ` +
                  (mode === Mode.PLAN
                    ? Account.getPlanName(activeId || 'None')
                    : Account.getScheduleName(activeId || 'None'))
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
      .catch((error: PaperError) => {
        this.showAlert(Utility.errorAlert('initialization', error));
      })
      .finally(() => {
        callback();
        d('initialization complete');
      });
  }

  componentDidUpdate(_: Readonly<{}>, prevState: Readonly<AppState>) {
    if (prevState.saveState !== 'start' && this.state.saveState === 'start') {
      d(
        'save timer reset (prev %s), waiting grace period before saving',
        this.state.saveTimeoutId
      );
      window.onbeforeunload = () => {
        return true;
      };

      const app = this;
      window.clearTimeout(this.state.saveTimeoutId);

      const activeIdKey =
        this.state.switches.get.mode === Mode.PLAN
          ? 'active_plan_id'
          : 'active_schedule_id';
      const activeId = this.state.switches.get[activeIdKey];
      const timeoutId = window.setTimeout(() => {
        const nowActiveId = this.state.switches.get[activeIdKey];
        if (nowActiveId !== activeId) {
          d('active id changed, aborting save');
          return;
        }
        d('saving now');
        update(app, this.state.switches.get.mode === Mode.SCHEDULE);
      }, 1500);
      this.setState({ saveState: 'wait', saveTimeoutId: timeoutId });
    }

    if (prevState.saveState !== 'idle' && this.state.saveState === 'idle') {
      d('there are no longer unsaved changes');
      window.onbeforeunload = null;
    }
  }

  setSwitch(key: keyof ReadUserOptions, val: any, save = false) {
    let switches = this.state.switches;
    if (
      key === 'active_plan_id' &&
      val === 'None' &&
      switches.get[key] !== val
    ) {
      this.setState({ saveState: 'idle' });
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

  showContextMenu(contextMenuData: ContextMenuData) {
    this.setState({ contextMenuData });
  }

  closeContextMenu() {
    this.setState({ contextMenuData: undefined });
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

  switchTerm(termId: string) {
    this.setState({ loadingLogin: true });
    this.initialize(
      () => {
        this.setState({ loadingLogin: false });
      },
      { changeTerm: termId }
    );
  }

  render() {
    const switches = this.state.switches;
    const tab = switches.get.tab;
    const darkMode = switches.get.dark;
    const isSchedule = switches.get.mode === Mode.SCHEDULE;

    const newerTermAvailable =
      isSchedule &&
      this.state.latestTermId !== undefined &&
      this.state.latestTermId !== this.state.schedule.termId;

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
          <div
            className={`${darkMode ? 'dark' : ''} relative`}
            ref={this.appRef}
          >
            {bn && this.state.banner && (
              <BannerNotice
                data={bn}
                alert={(alertData) => this.showAlert(alertData)}
                dismiss={() => {
                  localStorage.setItem('bn_id', bn!.id);
                  this.setState({ banner: false });
                }}
              />
            )}
            {this.state.alertData && (
              <Alert
                data={this.state.alertData}
                switches={switches}
                onConfirm={(data) => {
                  let alertData = this.state.alertData;
                  if (alertData?.action) {
                    alertData.action(data);
                  }
                }}
                onSwitch={(next) => {
                  this.showAlert(next);
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
            {this.state.sideCardData && (
              <SideCard
                data={this.state.sideCardData}
                switches={switches}
                onClose={() => this.closeSideCard()}
              />
            )}
            {this.state.contextMenuData && (
              <ContextMenu
                data={this.state.contextMenuData}
                switches={switches}
                onClose={() => {
                  this.closeContextMenu();
                }}
              />
            )}

            <AnimatePresence>
              {switches.get.notes && (
                <Notes
                  constraintsRef={this.appRef}
                  switches={switches}
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  onClose={() => switches.set('notes', false)}
                />
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 bg-white dark:bg-gray-800 lg:grid-cols-8">
              <div
                className={`col-span-2 flex h-192 flex-col px-4 ${
                  this.state.banner ? 'md:h-screen-banner' : 'md:h-screen'
                }`}
              >
                <Info
                  dark={darkMode}
                  openAboutMenu={() => this.setState({ about: true })}
                  newerTermAvailable={newerTermAvailable}
                  alert={(alertData) => this.showAlert(alertData)}
                  currentTermId={this.state.schedule.termId}
                  switchTerm={(termId) => this.switchTerm(termId)}
                />
                <ModeSwitch
                  switches={switches}
                  changeMode={(mode) => {
                    discardChanges(this, () => {
                      discardNotesChanges(
                        switches,
                        (alertData) => {
                          this.showAlert(alertData);
                        },
                        () => {
                          this.setSwitch('mode', mode, true);
                          this.setSwitch('notes', false);
                          this.setSwitch('unsaved_notes', false);
                          this.setState({ loadingLogin: true });
                          this.initialize(() => {
                            this.setState({ loadingLogin: false });
                          });
                        }
                      );
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
                  switchTerm={(termId) => this.switchTerm(termId)}
                  latestTermId={this.state.latestTermId}
                />
                {tab === 'Bookmarks' && (
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
                    recentShare={this.state.recentShare}
                    rf={this.state.rf}
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
                      deactivate(this);
                    }}
                    activeId={
                      switches.get[
                        `active_${isSchedule ? 'schedule' : 'plan'}_id`
                      ]
                    }
                    loading={this.state.loadingLogin}
                  />
                )}
                <Taskbar
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  version={VERSION}
                  switches={switches}
                />
              </div>

              <div
                className={`${
                  switches.get.compact ? 'compact-mode ' : ''
                } no-scrollbar col-span-6 flex flex-col pt-0 ${
                  this.state.banner ? 'lg:h-screen-banner' : 'lg:h-screen'
                } lg:overflow-y-scroll`}
              >
                <Toolbar
                  alert={(alertData) => {
                    this.showAlert(alertData);
                  }}
                  contextMenuData={this.state.contextMenuData}
                  contextMenu={(contextMenuData) => {
                    this.showContextMenu(contextMenuData);
                  }}
                  plan={this.state.data}
                  schedule={this.state.schedule}
                  openMap={() => {
                    this.setState({ map: true });
                  }}
                  switches={switches}
                  loading={this.state.loadingLogin}
                  openAboutMenu={() => this.setState({ about: true })}
                  openChangeLogPreview={() => this.setState({ clp: true })}
                  saveState={this.state.saveState}
                />
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
                      contextMenuData={this.state.contextMenuData}
                      contextMenu={(contextMenuData) => {
                        this.showContextMenu(contextMenuData);
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
                      contextMenuData={this.state.contextMenuData}
                      contextMenu={(contextMenuData) => {
                        this.showContextMenu(contextMenuData);
                      }}
                      interactions={this.state.scheduleInteractions}
                      sf={this.state.sf}
                      ff={this.state.ff}
                      switches={switches}
                      key="schedule"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence>
              {/* {this.state.unsavedChanges && (
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
              )} */}
            </AnimatePresence>
          </div>
        </MotionConfig>
      </DndProvider>
    );
  }
}

export default App;
