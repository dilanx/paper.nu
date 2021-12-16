
import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Content from './components/Content.js';
import CourseManager from './CourseManager.js';
import Utility from './Utility.js';
import Info from './components/menu/Info.js';
import TaskBar from './components/menu/TaskBar.js';
import Search from './components/search/Search.js';
import StatsBar from './components/menu/StatsBar.js';
import Contribution from './components/contribution/Contribution.js';
import Alert from './components/menu/Alert.js';

import { ExclamationIcon, PlusIcon } from '@heroicons/react/outline';

const VERSION = '0.1.16 (beta)';

class App extends React.Component {

    constructor(props) {
        super(props);
        let data = [[[], [], []], [[], [], []], [[], [], []], [[], [], []]];
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let failed = false;
        params.forEach((val, key, par) => {
            if (key.startsWith('y')) {
                if (failed) return;
                let newData = CourseManager.loadData(key, val, data);
                if (newData == null) {
                    failed = true;
                    return;
                }
                data = newData;
            }
        })

        let defaultAlert = null;

        if (failed) {
            data = [[[], [], []], [[], [], []], [[], [], []], [[], [], []]];
            defaultAlert = {
                title: 'Unable to load plan.',
                message: `The plan URL you entered is not valid. Ensure that it hasn't been manualy modified.`,
                confirmButton: 'What a shame.',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (<ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />)
            }
        }

        let defaultSwitches = Utility.loadSwitchesFromStorage();

        this.state = {
            data: data,
            alert: defaultAlert,
            switches: defaultSwitches
        }

    }

    setSwitch(key, val, save=false) {
        let switches = this.state.switches;
        switches[key] = val;
        this.setState({switches: switches});
        if (save) {
            Utility.saveSwitchToStorage(key, val);
        }
    }

    showAlert(alertData) {
        this.setState({
            alert: alertData
        })
    }

    postShowAlert() {
        this.setState({
            alert: null
        })
    }

    actuallyAddCourse(course, year, quarter) {
        let data = this.state.data;
        data[year][quarter].push(course);
        data[year][quarter].sort((a, b) => {
            return a.id.localeCompare(b.id);
        });
        this.setState({data: data});
        CourseManager.saveData(data);
    }

    addCourse(course, year, quarter) {

        let data = this.state.data;

        let exists = CourseManager.duplicateCourse(course, data);

        if (exists) {
            this.showAlert({
                title: 'Course already planned.',
                message: `You already have ${course.id} on your plan during the ${Utility.convertQuarter(exists.quarter).title.toLowerCase()} quarter of your ${Utility.convertYear(exists.year).toLowerCase()} year.`,
                cancelButton: 'Go back',
                confirmButton: 'Add anyway',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (<ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />),
                action: () => {
                    this.actuallyAddCourse(course, year, quarter);
                }
            })
            return;
        }

        let unitCount = CourseManager.getQuarterCredits(data[year][quarter]) + parseFloat(course.units);

        if (unitCount > 5.5) {
            this.showAlert({
                title: 'Too many classes.',
                message: `With this course, you'll have ${unitCount} units worth of classes this quarter, which is over Northwestern's maximum of 5.5 units.`,
                cancelButton: 'Go back',
                confirmButton: 'Add anyway',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (<ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />),
                action: () => {
                    this.actuallyAddCourse(course, year, quarter);
                }
            })
            return;
        }

        this.actuallyAddCourse(course, year, quarter);

    }

    delCourse(courseIndex, year, quarter) {
        let data = this.state.data;
        data[year][quarter].splice(courseIndex, 1);
        this.setState({data: data});
        CourseManager.saveData(data);
    }

    moveCourse(course, oldYear, oldQuarter, newYear, newQuarter) {
        let data = this.state.data;
        for (let c = 0; c < data[oldYear][oldQuarter].length; c++) {
            if (data[oldYear][oldQuarter][c].id === course.id) {
                this.delCourse(c, oldYear, oldQuarter);
                break;
            }
        }
        this.addCourse(course, newYear, newQuarter);
    }

    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="">

                    {this.state.alert &&
                        <Alert data={this.state.alert}
                            onClose={() => {
                                this.postShowAlert();
                            }}
                            onConfirm={() => {
                                if (this.state.alert.action) {
                                    this.state.alert.action();
                                }
                                this.postShowAlert();
                            }
                    }/>}

                    <div className="grid grid-cols-1 md:grid-cols-8">
                        <div className="col-span-2 px-4 h-192 md:h-screen flex flex-col">
                            <Info version={VERSION}/>
                            <TaskBar
                                alert={alertData => {
                                    this.showAlert(alertData)
                                }}
                                allowAddYear={this.state.data.length < 10}
                                addYear={() => {
                                    let data = this.state.data;
                                    data.push([[], [], []]);
                                    this.setState({data: data})
                                }}
                                version={VERSION}
                                switches={this.state.switches}
                                setSwitch={(key, val, save=false) => {this.setSwitch(key, val, save)}}
                            />
                            <Search
                                data={this.state.data}
                                addCourse={(course, year, quarter) => {
                                    this.addCourse(course, year, quarter);
                                }}
                            />
                            <StatsBar
                                data={this.state.data}
                            />
                        </div>
                        
                        <div className={`${this.state.switches.compact ? 'compact-mode ' : ''} col-span-6 block pt-0 h-screen md:overflow-y-scroll no-scrollbar`}>
                            {this.state.switches.contribution &&
                                <Contribution
                                alert={alertData => {
                                    this.showAlert(alertData)
                                }}/>
                                
                            }
                            
                            <Content
                                content={this.state.data}
                                switches={this.state.switches}
                                setSwitch={(key, val) => {this.setSwitch(key, val)}}
                                alert={alertData => {
                                    this.showAlert(alertData)
                                }}
                                addCourse={(course, year, quarter) => {
                                    this.addCourse(course, year, quarter);
                                }}
                                delCourse={(courseIndex, year, quarter) => {
                                    this.delCourse(courseIndex, year, quarter);
                                }}
                                moveCourse={(course, oldYear, oldQuarter, newYear, newQuarter) => {
                                    this.moveCourse(course, oldYear, oldQuarter, newYear, newQuarter);
                                }}
                                addSummerQuarter={year => {

                                    this.showAlert({
                                        title: 'Add summer quarter to this year?',
                                        message: `This will add a summer quarter to your ${Utility.convertYear(year).toLowerCase()} year. You can remove it by removing all classes from that quarter and refreshing the page.`,
                                        confirmButton: 'Add quarter',
                                        confirmButtonColor: 'blue',
                                        cancelButton: 'Close',
                                        iconBackgroundColor: 'blue',
                                        icon: (<PlusIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />),
                                        action: () => {
                                            let data = this.state.data;
                                            data[year].push([]);
                                            this.setState({data: data});
                                        }
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
