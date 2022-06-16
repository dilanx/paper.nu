import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Content from './components/Content';
import CourseManager from './CourseManager';
//import Account from './Account';
import Utility from './Utility';
import Info from './components/menu/Info';
import TaskBar from './components/menu/TaskBar';
import Search from './components/search/Search';
import Alert from './components/menu/Alert';
import Bookmarks from './components/bookmarks/Bookmarks';
import AccountPlans from './components/account/AccountPlans';
import {
    ExclamationIcon,
    PlusIcon,
    RefreshIcon,
    SaveIcon,
} from '@heroicons/react/outline';
import {
    Course,
    CourseLocation,
    PlanData,
    PlanModificationFunctions,
    PlanSpecialFunctions,
} from './types/PlanTypes';
import { AlertData } from './types/AlertTypes';
import { UserOptions, UserOptionValue } from './types/BaseTypes';
import Account from './Account';
import PlanError from './classes/PlanError';

const VERSION = '1.2.0';

interface AppState {
    data: PlanData;
    switches: UserOptions;
    alertData?: AlertData;
    f: PlanModificationFunctions;
    f2: PlanSpecialFunctions;
    loadingLogin: boolean;
    unsavedChanges: boolean;
    loadingUpdate: boolean;
    originalDataString: string;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        let defaultSwitches = Utility.loadSwitchesFromStorage(
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

        let f: PlanModificationFunctions = {
            addCourse: (course, location) => {
                app.addCourse(course, location);
            },
            removeCourse: (courseIndex, location) => {
                app.removeCourse(courseIndex, location);
            },
            moveCourse: (course, oldLocation, newLocation) => {
                app.moveCourse(course, oldLocation, newLocation);
            },
            addFavorite: (course, forCredit) => {
                app.addFavorite(course, forCredit);
            },
            removeFavorite: (course, forCredit) => {
                app.removeFavorite(course, forCredit);
            },
        };

        let f2: PlanSpecialFunctions = {
            addSummerQuarter: (year) => {
                app.addSummerQuarter(year);
            },
            addYear: () => {
                app.addYear();
            },
            clearData: () => {
                app.clearData();
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

        this.state = {
            data: data,
            switches: defaultSwitches,
            f,
            f2,
            loadingLogin: false,
            unsavedChanges: false,
            loadingUpdate: false,
            originalDataString: '',
        };
    }

    componentDidMount() {
        this.setState({ loadingLogin: true });
        let params = new URLSearchParams(window.location.search);

        let code = params.get('code');
        params.delete('code');
        let state = params.get('state');
        params.delete('state');

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`
        );

        if (code && state) {
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
                this.initializePlan(params, () => {
                    this.setState({ loadingLogin: false });
                });
            });
        } else {
            this.initializePlan(params, () => {
                this.setState({ loadingLogin: false });
            });
        }
    }

    initializePlan(params: URLSearchParams, callback: () => void) {
        CourseManager.load(params, this.state.switches)
            .then(({ data, activePlanId, originalDataString }) => {
                this.setState({ loadingLogin: false });
                if (data === 'malformed') {
                    this.showAlert({
                        title: 'Unable to load plan.',
                        message: `The plan you're trying to access is not valid. If you're loading it through a URL, ensure that it hasn't been manually modified.`,
                        confirmButton: 'What a shame.',
                        confirmButtonColor: 'red',
                        iconBackgroundColor: 'red',
                        icon: (
                            <ExclamationIcon
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                            />
                        ),
                    });
                    return;
                }
                this.setSwitch('active_plan_id', activePlanId, true);
                this.setState({ originalDataString });
                if (data === 'empty') {
                    return;
                }
                this.setState({ data });
            })
            .catch((error: PlanError) => {
                this.showAlert(
                    Utility.errorAlert('account_initial_login', error.message)
                );
            })
            .finally(() => callback());
    }

    componentDidUpdate(_: Readonly<{}>, prevState: Readonly<AppState>) {
        if (prevState.unsavedChanges !== this.state.unsavedChanges) {
            if (this.state.unsavedChanges) {
                window.onbeforeunload = () => {
                    return true;
                };
                document.title = '* ' + document.title;
            } else {
                window.onbeforeunload = null;
                document.title = document.title.replace(/\* /, '');
            }
        }
    }

    setSwitch(key: string, val: UserOptionValue, save = false) {
        let switches = this.state.switches;
        switches.get[key] = val;
        this.setState({ switches: switches });
        if (save) {
            Utility.saveSwitchToStorage(key, val?.toString());
        }
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

        let exists = CourseManager.duplicateCourse(course, data);

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
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    confirmationCallback();
                },
            });
            return;
        }

        let unitCount =
            CourseManager.getQuarterCredits(data.courses[year][quarter]) +
            parseFloat(course.units);

        if (unitCount > 5.5) {
            this.showAlert({
                title: 'Too many classes.',
                message: `With this course, you'll have ${unitCount} units worth of classes this quarter, which is over Northwestern's maximum of 5.5 units.`,
                cancelButton: 'Go back',
                confirmButton: 'Add anyway',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
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

            this.setState({
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    this.state.switches,
                    this.state.originalDataString
                ),
            });
        });
    }

    removeCourse(course: Course, { year, quarter }: CourseLocation) {
        if (year < 0) {
            this.removeFavorite(course, quarter === 1);
            return;
        }
        let data = this.state.data;
        data.courses[year][quarter].splice(
            data.courses[year][quarter].indexOf(course),
            1
        );
        this.setState({
            data,
            unsavedChanges: CourseManager.save(
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
                    data.courses[oy][oq].splice(
                        data.courses[oy][oq].indexOf(course),
                        1
                    );
                }
                let data = this.state.data;
                data.courses[ny][nq].push(course);
                data.courses[ny][nq].sort((a, b) => {
                    if (a.placeholder) return 1;
                    if (b.placeholder) return -1;
                    return a.id.localeCompare(b.id);
                });

                this.setState({
                    data,
                    unsavedChanges: CourseManager.save(
                        data,
                        this.state.switches,
                        this.state.originalDataString
                    ),
                });
            },
            true
        );
    }

    addFavorite(course: Course, forCredit: boolean) {
        let bookmarks = this.state.data.bookmarks;
        if (forCredit) {
            bookmarks.forCredit.add(course);
        } else {
            bookmarks.noCredit.add(course);
        }
        this.setState((prevState) => {
            const data = {
                ...prevState.data,
                bookmarks: bookmarks,
            };
            return {
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    this.state.switches,
                    prevState.originalDataString
                ),
            };
        });
    }

    removeFavorite(course: Course, forCredit: boolean) {
        let bookmarks = this.state.data.bookmarks;
        if (forCredit) {
            bookmarks.forCredit.delete(course);
        } else {
            bookmarks.noCredit.delete(course);
        }

        this.setState((prevState) => {
            const data = {
                ...prevState.data,
                bookmarks: bookmarks,
            };
            return {
                data,
                unsavedChanges: CourseManager.save(
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
            ).toLowerCase()} year. You can remove it by removing all classes from that quarter and refreshing the page.`,
            confirmButton: 'Add quarter',
            confirmButtonColor: 'yellow',
            cancelButton: 'Close',
            iconBackgroundColor: 'yellow',
            icon: (
                <PlusIcon
                    className="h-6 w-6 text-yellow-600"
                    aria-hidden="true"
                />
            ),
            action: () => {
                let data = this.state.data;
                data.courses[year].push([]);
                this.setState({ data: data });
            },
        });
    }

    addYear() {
        let data = this.state.data;
        data.courses.push([[], [], []]);
        this.setState({ data: data });
    }

    clearData() {
        let data = {
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
        this.setState({
            data,
            unsavedChanges: CourseManager.save(
                data,
                this.state.switches,
                this.state.originalDataString
            ),
        });
    }

    activateAccountPlan(planId: string) {
        Account.getPlans()
            .then((plans) => {
                if (!plans) {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Undefined Plans'
                        )
                    );
                    return;
                }
                let plan = plans[planId];
                if (!plan) {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Undefined Plan'
                        )
                    );
                    return;
                }
                let data = CourseManager.loadFromString(plan.content);
                if (data === 'malformed') {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Malformed Plan'
                        )
                    );
                    return;
                }

                if (data === 'empty') {
                    this.setSwitch('active_plan_id', planId, true);
                    this.setState({
                        originalDataString: plan.content,
                        unsavedChanges: window.location.search.length > 0,
                    });
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
                        () => CourseManager.save(data as PlanData)
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
            this.setSwitch('active_plan_id', 'None', true);
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
        this.setState({ loadingUpdate: true });
        Account.updatePlan(
            activePlanId as string,
            CourseManager.getDataString(this.state.data)
        )
            .catch((error: PlanError) => {
                this.showAlert(
                    Utility.errorAlert('account_update_plan', error.message)
                );
            })
            .finally(() => {
                this.setState({ loadingUpdate: false, unsavedChanges: false });
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
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    this.setState({ unsavedChanges: false });
                    action();
                },
            });
            return;
        }

        action();
    }

    render() {
        let switches = this.state.switches;
        let tab = switches.get.tab;
        return (
            <DndProvider backend={HTML5Backend}>
                <div className={`${switches.get.dark ? 'dark' : ''} relative`}>
                    {this.state.alertData && (
                        <Alert
                            data={this.state.alertData}
                            switches={switches}
                            onConfirm={(inputText?: string) => {
                                let alertData = this.state.alertData;
                                if (alertData?.action) {
                                    alertData.action(inputText);
                                }
                                this.postShowAlert();
                            }}
                            onClose={() => {
                                this.postShowAlert();
                            }}
                        />
                    )}

                    <div className="bg-white dark:bg-gray-800 grid grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 px-4 h-192 md:h-screen flex flex-col">
                            <Info />
                            <Search
                                data={this.state.data}
                                switches={switches}
                                f={this.state.f}
                            />
                            {tab === 'My List' && (
                                <Bookmarks
                                    bookmarks={this.state.data.bookmarks}
                                    alert={(alertData) => {
                                        this.showAlert(alertData);
                                    }}
                                    f={this.state.f}
                                    switches={switches}
                                />
                            )}
                            {tab === 'Plans' && (
                                <AccountPlans
                                    data={this.state.data}
                                    alert={(alertData) => {
                                        this.showAlert(alertData);
                                    }}
                                    activatePlan={(planId) => {
                                        this.activateAccountPlan(planId);
                                    }}
                                    deactivatePlan={() => {
                                        this.deactivatePlan();
                                    }}
                                    activePlanId={
                                        switches.get.active_plan_id as string
                                    }
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
                            <Content
                                data={this.state.data}
                                f={this.state.f}
                                f2={this.state.f2}
                                alert={(alertData) => {
                                    this.showAlert(alertData);
                                }}
                                switches={switches}
                            />
                        </div>
                    </div>
                    {this.state.unsavedChanges && (
                        <div
                            className={`fixed right-12 ${
                                switches.get.save_location_top
                                    ? 'top-8'
                                    : 'bottom-8'
                            }`}
                        >
                            <button
                                className={`flex items-center gap-2 rainbow-border-button shadow-lg opacity-75 hover:opacity-100 focus:before:bg-none focus:before:bg-emerald-400
                                after:bg-gray-100 text-black dark:after:bg-gray-700 dark:text-white ${
                                    this.state.loadingUpdate
                                        ? 'before:bg-none before:bg-emerald-400'
                                        : ''
                                }`}
                                onClick={() => {
                                    this.updatePlan();
                                }}
                                disabled={this.state.loadingUpdate}
                            >
                                {this.state.loadingUpdate ? (
                                    <>
                                        <RefreshIcon className="h-6 w-6 inline-block animate-reverse-spin" />
                                        <p className="inline-block text-lg font-extrabold">
                                            SAVING
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="h-6 w-6 inline-block" />
                                        <p className="inline-block text-lg font-extrabold">
                                            SAVE
                                        </p>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </DndProvider>
        );
    }
}

export default App;
