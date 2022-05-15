import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Content from './components/Content.js';
import CourseManager from './CourseManager.js';
import Utility from './Utility.js';
import Info from './components/menu/Info.js';
import TaskBar from './components/menu/TaskBar.js';
import Search from './components/search/Search.js';
import StatsBar from './components/menu/StatsBar.js';
import Alert from './components/menu/Alert.js';
import Favorites from './components/favorites/Favorites.js';
import { ExclamationIcon, PlusIcon } from '@heroicons/react/outline';

const VERSION = '1.2.0';

class App extends React.Component {
    constructor(props) {
        super(props);

        let defaultSwitches = Utility.loadSwitchesFromStorage();
        let defaultAlert = null;

        let data = [
            [[], [], []],
            [[], [], []],
            [[], [], []],
            [[], [], []],
        ];
        let favorites = {
            noCredit: new Set(),
            forCredit: new Set(),
        };

        let res = CourseManager.load(defaultSwitches.save_to_storage);

        if (!res.malformed) {
            if (!res.empty) {
                data = res.data;
                favorites = res.favorites;
            }
        } else {
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

        if (defaultSwitches.dark) {
            document.body.style.backgroundColor = Utility.BACKGROUND_DARK;
            document
                .querySelector('meta[name="theme-color"]')
                .setAttribute('content', Utility.BACKGROUND_DARK);
        } else {
            document.body.style.backgroundColor = Utility.BACKGROUND_LIGHT;
            document
                .querySelector('meta[name="theme-color"]')
                .setAttribute('content', Utility.BACKGROUND_LIGHT);
        }

        this.state = {
            data: data,
            favorites: favorites,
            alert: defaultAlert,
            switches: defaultSwitches,
        };
    }

    setSwitch(key, val, save = false) {
        let switches = this.state.switches;
        switches[key] = val;
        this.setState({ switches: switches });
        if (save) {
            Utility.saveSwitchToStorage(key, val);
        }
    }

    showAlert(alertData) {
        this.setState({
            alert: alertData,
        });
    }

    postShowAlert() {
        this.setState({
            alert: null,
        });
    }

    actuallyAddCourse(course, year, quarter) {
        let data = this.state.data;
        data[year][quarter].push(course);
        data[year][quarter].sort((a, b) => {
            if (a.placeholder) return 1;
            if (b.placeholder) return -1;
            return a.id.localeCompare(b.id);
        });
        this.setState({ data: data });
        CourseManager.save(
            data,
            this.state.favorites,
            this.state.switches.save_to_storage
        );
    }

    addCourse(course, year, quarter) {
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
            CourseManager.getQuarterCredits(data[year][quarter]) +
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

    delCourse(courseIndex, year, quarter) {
        let data = this.state.data;
        data[year][quarter].splice(courseIndex, 1);
        this.setState({ data: data });
        CourseManager.save(
            data,
            this.state.favorites,
            this.state.switches.save_to_storage
        );
    }

    moveCourse(course, oldYear, oldQuarter, newYear, newQuarter) {
        let data = this.state.data;
        if (oldYear !== -1) {
            for (let c = 0; c < data[oldYear][oldQuarter].length; c++) {
                if (data[oldYear][oldQuarter][c].id === course.id) {
                    this.delCourse(c, oldYear, oldQuarter);
                    break;
                }
            }
        }
        this.addCourse(course, newYear, newQuarter);
    }

    addFavorite(course, forCredit) {
        let favorites = this.state.favorites;
        if (forCredit) {
            favorites.forCredit.add(course);
        } else {
            favorites.noCredit.add(course);
        }
        this.setState({ favorites: favorites });
        CourseManager.save(
            this.state.data,
            favorites,
            this.state.switches.save_to_storage
        );
    }

    delFavorite(course, forCredit) {
        let favorites = this.state.favorites;
        if (forCredit) {
            favorites.forCredit.delete(course);
        } else {
            favorites.noCredit.delete(course);
        }
        this.setState({ favorites: favorites });
        CourseManager.save(
            this.state.data,
            favorites,
            this.state.switches.save_to_storage
        );
    }

    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <div className={`${this.state.switches.dark ? 'dark' : ''}`}>
                    {this.state.alert && (
                        <Alert
                            data={this.state.alert}
                            switches={this.state.switches}
                            setSwitch={(key, val, save = false) => {
                                this.setSwitch(key, val, save);
                            }}
                            onClose={() => {
                                this.postShowAlert();
                            }}
                            onConfirm={() => {
                                if (this.state.alert.action) {
                                    this.state.alert.action();
                                }
                                this.postShowAlert();
                            }}
                        />
                    )}

                    <div className="bg-white dark:bg-gray-800 grid grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 px-4 h-192 md:h-screen flex flex-col">
                            <Info version={VERSION} />
                            <TaskBar
                                alert={alertData => {
                                    this.showAlert(alertData);
                                }}
                                version={VERSION}
                                switches={this.state.switches}
                                setSwitch={(key, val, save = false) => {
                                    this.setSwitch(key, val, save);
                                }}
                                clearData={() => {
                                    this.setState({
                                        data: [
                                            [[], [], []],
                                            [[], [], []],
                                            [[], [], []],
                                            [[], [], []],
                                        ],
                                        favorites: {
                                            forCredit: new Set(),
                                            noCredit: new Set(),
                                        },
                                    });
                                    CourseManager.save(
                                        this.state.data,
                                        this.state.favorites,
                                        this.state.switches.save_to_storage
                                    );
                                }}
                            />
                            <Search
                                data={this.state.data}
                                favorites={this.state.favorites}
                                addCourse={(course, year, quarter) => {
                                    this.addCourse(course, year, quarter);
                                }}
                                addFavorite={(course, forCredit) => {
                                    this.addFavorite(course, forCredit);
                                }}
                                delFavorite={(course, forCredit) => {
                                    this.delFavorite(course, forCredit);
                                }}
                            />
                            <StatsBar
                                data={this.state.data}
                                favorites={this.state.favorites}
                            />
                        </div>

                        <div
                            className={`${
                                this.state.switches.compact
                                    ? 'compact-mode '
                                    : ''
                            } col-span-6 block pt-0 lg:h-screen lg:overflow-y-scroll no-scrollbar`}
                        >
                            {this.state.switches.favorites && (
                                <Favorites
                                    favorites={this.state.favorites}
                                    switches={this.state.switches}
                                    alert={alertData => {
                                        this.showAlert(alertData);
                                    }}
                                    addFavorite={(course, forCredit) => {
                                        this.addFavorite(course, forCredit);
                                    }}
                                    delFavorite={(course, forCredit) => {
                                        this.delFavorite(course, forCredit);
                                    }}
                                />
                            )}
                            <Content
                                content={this.state.data}
                                favorites={this.state.favorites}
                                switches={this.state.switches}
                                setSwitch={(key, val) => {
                                    this.setSwitch(key, val);
                                }}
                                alert={alertData => {
                                    this.showAlert(alertData);
                                }}
                                allowAddYear={this.state.data.length < 10}
                                addYear={() => {
                                    let data = this.state.data;
                                    data.push([[], [], []]);
                                    this.setState({ data: data });
                                }}
                                addCourse={(course, year, quarter) => {
                                    this.addCourse(course, year, quarter);
                                }}
                                delCourse={(courseIndex, year, quarter) => {
                                    this.delCourse(courseIndex, year, quarter);
                                }}
                                moveCourse={(
                                    course,
                                    oldYear,
                                    oldQuarter,
                                    newYear,
                                    newQuarter
                                ) => {
                                    this.moveCourse(
                                        course,
                                        oldYear,
                                        oldQuarter,
                                        newYear,
                                        newQuarter
                                    );
                                }}
                                addFavorite={(course, forCredit) => {
                                    this.addFavorite(course, forCredit);
                                }}
                                delFavorite={(course, forCredit) => {
                                    this.delFavorite(course, forCredit);
                                }}
                                addSummerQuarter={year => {
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
                                            data[year].push([]);
                                            this.setState({ data: data });
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </DndProvider>
        );
    }
}

export default App;
