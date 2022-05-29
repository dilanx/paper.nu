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
import Favorites from './components/favorites/Favorites';
//import Plans from './components/account/AccountPlans';
import { ExclamationIcon, PlusIcon } from '@heroicons/react/outline';
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

const VERSION = '1.2.0';

interface AppProps {
    search: string;
}

interface AppState {
    data: PlanData;
    switches: UserOptions;
    alertData?: AlertData;
    f: PlanModificationFunctions;
    f2: PlanSpecialFunctions;
    loadingLogin: boolean;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
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
            favorites: {
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
            addSummerQuarter: year => {
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
            loadingLogin: true,
        };
    }

    componentDidMount() {
        let switches = this.state.switches;
        let data = this.state.data;
        let defaultAlert: AlertData | undefined = undefined;

        let params = new URLSearchParams(this.props.search);
        if (params.has('code')) {
            this.setState({ loadingLogin: true });
            Account.login(params.get('code')!).then(response => {
                if (!response?.success) {
                    defaultAlert = Utility.errorAlert(
                        'account_initial_login',
                        response.data as string
                    );
                }
                this.setState({ loadingLogin: false });
            });
            params.delete('code');
        }
        if (params.has('state')) {
            let uiState = params.get('state')!.split(',');
            if (uiState.includes('view_plans')) {
                switches.set('tab', 'Plans');
            }
            params.delete('state');
        }

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`
        );

        let res = CourseManager.load(
            params,
            switches.get.save_to_storage as boolean
        );

        if (res !== 'malformed') {
            if (res !== 'empty') {
                data = res;
            }
        } else {
            if (!defaultAlert) {
                defaultAlert = {
                    title: 'Unable to load plan.',
                    message: `The plan URL you entered is not valid. Ensure that it hasn't been manually modified.`,
                    confirmButton: 'What a shame.',
                    confirmButtonColor: 'red',
                    iconBackgroundColor: 'red',
                    icon: (
                        <ExclamationIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                        />
                    ),
                };
            }
        }

        this.setState({ data, alertData: defaultAlert });
    }

    setSwitch(key: string, val: UserOptionValue, save = false) {
        let switches = this.state.switches;
        switches.get[key] = val;
        this.setState({ switches: switches });
        if (save) {
            Utility.saveSwitchToStorage(key, val.toString());
        }
    }

    showAlert(alertData: AlertData) {
        this.setState({ alertData });
    }

    postShowAlert() {
        this.setState({ alertData: undefined });
    }

    actuallyAddCourse(course: Course, year: number, quarter: number) {
        let data = this.state.data;
        data.courses[year][quarter].push(course);
        data.courses[year][quarter].sort((a, b) => {
            if (a.placeholder) return 1;
            if (b.placeholder) return -1;
            return a.id.localeCompare(b.id);
        });
        this.setState({ data: data });
        CourseManager.save(
            data,
            this.state.switches.get.save_to_storage as boolean
        );
    }

    addCourse(course: Course, { year, quarter }: CourseLocation) {
        let data = this.state.data;
        let isPlaceholder = course.placeholder;
        let repeatable = course.repeatable;

        let exists = CourseManager.duplicateCourse(course, data);

        if (!repeatable && exists && !isPlaceholder) {
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
                    this.actuallyAddCourse(course, year, quarter);
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
                    this.actuallyAddCourse(course, year, quarter);
                },
            });
            return;
        }

        this.actuallyAddCourse(course, year, quarter);
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
        this.setState({ data: data });
        CourseManager.save(
            data,
            this.state.switches.get.save_to_storage as boolean
        );
    }

    moveCourse(
        course: Course,
        { year: oy, quarter: oq }: CourseLocation,
        newLocation: CourseLocation
    ) {
        if (oy !== -1) {
            this.removeCourse(course, { year: oy, quarter: oq });
        }
        this.addCourse(course, newLocation);
    }

    addFavorite(course: Course, forCredit: boolean) {
        let favorites = this.state.data.favorites;
        if (forCredit) {
            favorites.forCredit.add(course);
        } else {
            favorites.noCredit.add(course);
        }
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                favorites: favorites,
            },
        }));
        CourseManager.save(
            this.state.data,
            this.state.switches.get.save_to_storage as boolean
        );
    }

    removeFavorite(course: Course, forCredit: boolean) {
        let favorites = this.state.data.favorites;
        if (forCredit) {
            favorites.forCredit.delete(course);
        } else {
            favorites.noCredit.delete(course);
        }

        this.setState(
            prevState => ({
                data: {
                    ...prevState.data,
                    favorites: favorites,
                },
            }),
            () => {
                CourseManager.save(
                    this.state.data,
                    this.state.switches.get.save_to_storage as boolean
                );
            }
        );
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
        this.setState({
            data: {
                courses: [
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                ],
                favorites: {
                    forCredit: new Set<Course>(),
                    noCredit: new Set<Course>(),
                },
            },
        });
        CourseManager.save(
            this.state.data,
            this.state.switches.get.save_to_storage as boolean
        );
    }

    render() {
        let tab = this.state.switches.get.tab;
        return (
            <DndProvider backend={HTML5Backend}>
                <div
                    className={`${this.state.switches.get.dark ? 'dark' : ''}`}
                >
                    {this.state.alertData && (
                        <Alert
                            data={this.state.alertData}
                            switches={this.state.switches}
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
                                switches={this.state.switches}
                                f={this.state.f}
                            />
                            {tab === 'My List' && (
                                <Favorites
                                    favorites={this.state.data.favorites}
                                    alert={alertData => {
                                        this.showAlert(alertData);
                                    }}
                                    f={this.state.f}
                                    switches={this.state.switches}
                                />
                            )}
                            {/* {tab === 'Plans' && (
                                TODO implement plans
                                <Plans
                                    switches={this.state.switches}
                                    alert={alertData => {
                                        this.showAlert(alertData);
                                    }}
                                />
                            )} */}
                            <TaskBar
                                alert={alertData => {
                                    this.showAlert(alertData);
                                }}
                                version={VERSION}
                                switches={this.state.switches}
                                f2={this.state.f2}
                                tabLoading={this.state.loadingLogin}
                            />
                        </div>

                        <div
                            className={`${
                                this.state.switches.get.compact
                                    ? 'compact-mode '
                                    : ''
                            } col-span-6 block pt-0 lg:h-screen lg:overflow-y-scroll no-scrollbar`}
                        >
                            <Content
                                data={this.state.data}
                                f={this.state.f}
                                f2={this.state.f2}
                                alert={alertData => {
                                    this.showAlert(alertData);
                                }}
                                switches={this.state.switches}
                            />
                        </div>
                    </div>
                </div>
            </DndProvider>
        );
    }
}

export default App;
