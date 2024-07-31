import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast, { Toaster } from 'react-hot-toast';
import { getPlanName, getScheduleName, login } from './app/Account';
import {
  activateAccountPlan,
  activateAccountSchedule,
  deactivate,
  discardChanges,
  discardNotesChanges,
  update,
} from './app/AccountModification';
import bn from './app/BannerNotice';
import { AppProvider, DataProvider, ModificationProvider } from './app/Context';
import { getTermName } from './app/Data';
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
  activateRecentShare,
  getRecentShare,
  removeRecentShareHistory,
  updateRecentShare,
} from './app/RecentShare';
import {
  load,
  loadUserOptionsFromStorage,
  saveUserOptionToStorage,
} from './app/SaveData';
import {
  addOverride,
  addScheduleBookmark,
  addSection,
  checkOverrides,
  clearSchedule,
  putCustomSection,
  removeOverrides,
  removeScheduleBookmark,
  removeSection,
} from './app/ScheduleModification';
import AccountPlans from './components/account/AccountPlans';
import Bookmarks from './components/bookmarks/Bookmarks';
import CampusMap from './components/map/CampusMap';
import BannerNotice from './components/menu/BannerNotice';
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
import { openInfo as planOpenInfo } from './components/plan/CourseInfo';
import Ratings from './components/rating/Ratings';
import Schedule from './components/schedule/Schedule';
import { openInfo as scheduleOpenInfo } from './components/schedule/ScheduleSectionInfo';
import Search from './components/search/Search';
import { RecentShareModificationFunctions } from './types/AccountTypes';
import { AlertData } from './types/AlertTypes';
import {
  AppContext,
  AppState,
  AppType,
  ContextMenuData,
  ReadUserOptions,
  SaveDataOptions,
} from './types/BaseTypes';
import { Course, PlanData, PlanModificationFunctions } from './types/PlanTypes';
import { RatingsViewData } from './types/RatingTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from './types/ScheduleTypes';
import { SearchModificationFunctions } from './types/SearchTypes';
import { SideCardData } from './types/SideCardTypes';
import { Mode } from './utility/Constants';
import { PaperError } from './utility/PaperError';
import {
  BACKGROUND_DARK,
  BACKGROUND_LIGHT,
  errorAlert,
} from './utility/Utility';
const d = debug('app');

const VERSION = process.env.REACT_APP_VERSION ?? '0.0.0';
const VERSION_NO_PATCH = VERSION.split('.').slice(0, 2).join('.');

class App
  extends React.Component<Record<string, never>, AppState>
  implements AppType
{
  appRef;

  constructor(props: Record<string, never>) {
    super(props);

    const userOptions = loadUserOptionsFromStorage((key, value, save) => {
      this.setUserOption(key, value, save);
    });
    userOptions.get.tab = 'Search';

    const data: PlanData = {
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
        addCourse(this, course, location);
      },
      removeCourse: (courseIndex, location) => {
        removeCourse(this, courseIndex, location);
      },
      moveCourse: (course, oldLocation, newLocation) => {
        moveCourse(this, course, oldLocation, newLocation);
      },
      addBookmark: (course, forCredit) => {
        addBookmark(this, course, forCredit);
      },
      removeBookmark: (course, forCredit) => {
        removeBookmark(this, course, forCredit);
      },
      putCustomCourse: (location, courseToEdit) => {
        putCustomCourse(this, location, courseToEdit);
      },
      addSummerQuarter: (year) => {
        addSummerQuarter(this, year);
      },
      removeSummerQuarter: (year) => {
        removeSummerQuarter(this, year);
      },
      addYear: () => {
        addYear(this);
      },
      removeYear: (year) => {
        removeYear(this, year);
      },
      clearData: (year?: number) => {
        clearData(this, year);
      },
    };

    const sf: ScheduleModificationFunctions = {
      addSection: (section) => addSection(this, section),
      removeSection: (section) => removeSection(this, section),
      addOverride: (override) => addOverride(this, override),
      checkOverrides: (section) => checkOverrides(this, section),
      removeOverrides: (sectionId) => removeOverrides(this, sectionId),
      addScheduleBookmark: (course) => addScheduleBookmark(this, course),
      removeScheduleBookmark: (course) => removeScheduleBookmark(this, course),
      putCustomSection: (sectionToEdit) =>
        putCustomSection(this, sectionToEdit),
      clear: () => clearSchedule(this),
    };

    const ff: SearchModificationFunctions = {
      set: (query, current) => {
        this.setUserOption('tab', 'Search');
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
      open: (shortCode) => activateRecentShare(this, shortCode),
      remove: (shortCode) => removeRecentShareHistory(this, shortCode),
    };

    if (userOptions.get.dark) {
      document.body.style.backgroundColor = BACKGROUND_DARK;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', BACKGROUND_DARK);
    } else {
      document.body.style.backgroundColor = BACKGROUND_LIGHT;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', BACKGROUND_LIGHT);
    }

    const lastVersion = localStorage.getItem('v');
    const bannerNoticeId = localStorage.getItem('bn_id');

    this.appRef = React.createRef<HTMLDivElement>();
    this.state = {
      data: data,
      schedule: {
        schedule: {},
        bookmarks: [],
        overrides: [],
      },
      userOptions,
      f,
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
          this.setUserOption('mode', Mode.PLAN);
          break;
        case 'schedule':
          this.setUserOption('mode', Mode.SCHEDULE);
          break;
      }
    }

    if (search) {
      this.state.ff.set(search);
    }

    if (code && state) {
      d('query has code and state, logging in');
      login(code, state).then((response) => {
        if (!response.success) {
          this.showAlert(
            errorAlert(
              'account_initial_login_code',
              new PaperError(response.data as string)
            )
          );
        } else {
          this.setUserOption('tab', 'Plans');
          this.setUserOption('active_plan_id', 'None', true);
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
    load(this.state.userOptions, options)
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

          const appContext: AppContext = {
            version: VERSION,
            userOptions: this.state.userOptions,
            activeContextMenu: this.state.contextMenuData?.name,
            alert: (alertData: AlertData) => this.showAlert(alertData),
            sideCard: (sideCardData: SideCardData) =>
              this.showSideCard(sideCardData),
            contextMenu: (contextMenuData: ContextMenuData) =>
              this.showContextMenu(contextMenuData),
            ratingsView: (ratingsData: RatingsViewData) =>
              this.showRatingsView(ratingsData),
            mapView: () => this.setState({ map: true }),
          };

          if (sharedCourse) {
            planOpenInfo(sharedCourse, appContext, false);
          }

          if (sharedSection) {
            scheduleOpenInfo(
              { section: sharedSection },
              appContext,
              undefined,
              {
                searchModification: this.state.ff,
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
          this.setUserOption('mode', mode);
          this.setUserOption(
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
            case 'URL': {
              toast.success(
                `Loaded shared ${modeStr}${
                  recentShare && typeof recentShare !== 'string'
                    ? `: ${recentShare.name}`
                    : ''
                }`
              );
              break;
            }
            case 'Account': {
              toast.success(
                `Loaded ${modeStr}: ` +
                  (mode === Mode.PLAN
                    ? getPlanName(activeId)
                    : getScheduleName(activeId))
              );
              break;
            }
            case 'Storage': {
              toast.success(`Loaded recently edited ${modeStr}`);
              break;
            }
            case 'TermChange': {
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
        }
      )
      .catch((error: PaperError) => {
        this.showAlert(errorAlert('initialization', error));
      })
      .finally(() => {
        callback();
        d('initialization complete');
      });
  }

  componentDidUpdate(
    _: Readonly<Record<string, never>>,
    prevState: Readonly<AppState>
  ) {
    if (prevState.saveState !== 'start' && this.state.saveState === 'start') {
      d(
        'save timer reset (prev %s), waiting grace period before saving',
        this.state.saveTimeoutId
      );
      window.onbeforeunload = () => {
        return true;
      };

      window.clearTimeout(this.state.saveTimeoutId);

      const activeIdKey =
        this.state.userOptions.get.mode === Mode.PLAN
          ? 'active_plan_id'
          : 'active_schedule_id';
      const activeId = this.state.userOptions.get[activeIdKey];
      const timeoutId = window.setTimeout(() => {
        const nowActiveId = this.state.userOptions.get[activeIdKey];
        if (nowActiveId !== activeId) {
          d('active id changed, aborting save');
          return;
        }
        d('saving now');
        update(this, this.state.userOptions.get.mode === Mode.SCHEDULE);
      }, 1500);
      this.setState({ saveState: 'wait', saveTimeoutId: timeoutId });
    }

    if (prevState.saveState !== 'idle' && this.state.saveState === 'idle') {
      d('there are no longer unsaved changes');
      window.onbeforeunload = null;
    }
  }

  setUserOption(key: keyof ReadUserOptions, val: any, save = false) {
    const userOptions = this.state.userOptions;
    if (
      key === 'active_plan_id' &&
      val === 'None' &&
      userOptions.get[key] !== val
    ) {
      this.setState({ saveState: 'idle' });
    }
    userOptions.get[key] = val;
    this.setState({ userOptions });
    if (save) {
      saveUserOptionToStorage(key, val?.toString());
    }
    d('switch set: %s = %s', key, val);
  }

  showAlert(alertData: AlertData) {
    this.setState({ alertData });
  }

  postShowAlert() {
    this.setState({ alertData: undefined });
  }

  showSideCard(sideCardData: SideCardData) {
    this.setState({ sideCardData });
  }

  closeSideCard() {
    this.setState({ sideCardData: undefined });
  }

  showContextMenu(contextMenuData: ContextMenuData) {
    this.setState({ contextMenuData });
  }

  closeContextMenu() {
    this.setState({ contextMenuData: undefined });
  }

  showRatingsView(ratingsData: RatingsViewData) {
    this.setState({ ratings: ratingsData });
  }

  closeRatingsView() {
    this.setState({ ratings: undefined });
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
    const scheduleInteractions = this.state.scheduleInteractions;
    for (const interaction of interactions) {
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
    const userOptions = this.state.userOptions;
    const tab = userOptions.get.tab;
    const darkMode = userOptions.get.dark;
    const isSchedule = userOptions.get.mode === Mode.SCHEDULE;

    const newerTermAvailable =
      isSchedule &&
      this.state.latestTermId !== undefined &&
      this.state.latestTermId !== this.state.schedule.termId;

    return (
      <DndProvider backend={HTML5Backend}>
        <AppProvider
          value={{
            version: VERSION,
            userOptions,
            activeContextMenu: this.state.contextMenuData?.name,
            alert: (alertData: AlertData) => this.showAlert(alertData),
            sideCard: (sideCardData: SideCardData) =>
              this.showSideCard(sideCardData),
            contextMenu: (contextMenuData: ContextMenuData) =>
              this.showContextMenu(contextMenuData),
            ratingsView: (ratingsData: RatingsViewData) =>
              this.showRatingsView(ratingsData),
            mapView: () => this.setState({ map: true }),
          }}
        >
          <DataProvider
            value={{
              plan: this.state.data,
              schedule: this.state.schedule,
            }}
          >
            <ModificationProvider
              value={{
                planModification: this.state.f,
                scheduleModification: this.state.sf,
                searchModification: this.state.ff,
                recentShareModification: this.state.rf,
              }}
            >
              {userOptions.get.notifications && (
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
                reducedMotion={
                  userOptions.get.reduced_motion ? 'always' : 'never'
                }
              >
                <div
                  className={`${darkMode ? 'dark' : ''} relative`}
                  ref={this.appRef}
                >
                  {bn && this.state.banner && (
                    <BannerNotice
                      data={bn}
                      dismiss={() => {
                        localStorage.setItem('bn_id', bn!.id);
                        this.setState({ banner: false });
                      }}
                    />
                  )}
                  {this.state.alertData && (
                    <Alert
                      data={this.state.alertData}
                      onConfirm={(data) => {
                        const alertData = this.state.alertData;
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
                    <About onClose={() => this.setState({ about: false })} />
                  )}

                  {this.state.ratings && (
                    <Ratings
                      data={this.state.ratings}
                      onClose={() => this.setState({ ratings: undefined })}
                    />
                  )}

                  {this.state.map && (
                    <CampusMap
                      onClose={() => {
                        this.setState({ map: false });
                      }}
                    />
                  )}
                  {this.state.sideCardData && (
                    <SideCard
                      data={this.state.sideCardData}
                      onClose={() => this.closeSideCard()}
                    />
                  )}
                  {this.state.contextMenuData && (
                    <ContextMenu
                      data={this.state.contextMenuData}
                      onClose={() => {
                        this.closeContextMenu();
                      }}
                    />
                  )}

                  <AnimatePresence>
                    {userOptions.get.notes && (
                      <Notes
                        constraintsRef={this.appRef}
                        onClose={() => userOptions.set('notes', false)}
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
                        currentTermId={this.state.schedule.termId}
                        switchTerm={(termId) => this.switchTerm(termId)}
                      />
                      <ModeSwitch
                        switches={userOptions}
                        changeMode={(mode) => {
                          discardChanges(this, () => {
                            discardNotesChanges(
                              userOptions,
                              (alertData) => {
                                this.showAlert(alertData);
                              },
                              () => {
                                this.setUserOption('mode', mode, true);
                                this.setUserOption('notes', false);
                                this.setUserOption('unsaved_notes', false);
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
                        scheduleInteractions={this.state.scheduleInteractions}
                        defaults={this.state.searchDefaults}
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
                      />
                      {tab === 'Bookmarks' && (
                        <Bookmarks
                          scheduleInteractions={this.state.scheduleInteractions}
                          loading={this.state.loadingLogin}
                        />
                      )}
                      {tab === 'Plans' && (
                        <AccountPlans
                          recentShare={this.state.recentShare}
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
                            userOptions.get[
                              `active_${isSchedule ? 'schedule' : 'plan'}_id`
                            ]
                          }
                          loading={this.state.loadingLogin}
                        />
                      )}
                      <Taskbar />
                    </div>

                    <div
                      className={`${
                        userOptions.get.compact ? 'compact-mode ' : ''
                      } no-scrollbar col-span-6 flex flex-col pt-0 ${
                        this.state.banner ? 'lg:h-screen-banner' : 'lg:h-screen'
                      } lg:overflow-y-scroll`}
                    >
                      <Toolbar
                        loading={this.state.loadingLogin}
                        openAboutMenu={() => this.setState({ about: true })}
                        saveState={this.state.saveState}
                      />
                      <AnimatePresence mode="wait">
                        {userOptions.get.mode === Mode.PLAN ? (
                          <Content key="plan" />
                        ) : (
                          <Schedule
                            interactions={this.state.scheduleInteractions}
                            key="schedule"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </MotionConfig>
            </ModificationProvider>
          </DataProvider>
        </AppProvider>
      </DndProvider>
    );
  }
}

export default App;
