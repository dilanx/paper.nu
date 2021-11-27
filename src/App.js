
import React from 'react';
import Content from './Content.js';
import Search from './Search.js';
import Utility from './Utility.js';
import Info from './Info.js';
import TaskBar from './TaskBar.js';
import Alert from './Alert.js';

import { ExclamationIcon } from '@heroicons/react/outline';

const VERSION = '1.0.3 beta';

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
                let newData = Utility.loadData(key, val, data);
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

        this.state = {
            data: data,
            alert: defaultAlert

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

    render() {
        return (
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
                    <div className="col-span-2 px-4 block md:sticky top-0 h-96 md:h-screen ">
                        <Info version={VERSION}/>
                        <TaskBar alert={alertData => {
                            this.showAlert(alertData)
                        }} version={VERSION}/>
                        <Search addCourse={(course, year, quarter) => {
                            let data = this.state.data;
                            let fulfilledPrereqs = Utility.checkPrereq(course, year, quarter, data);

                            if (!fulfilledPrereqs) {
                                this.showAlert({
                                    title: 'Missing prerequisite courses.',
                                    message: `You can't take this course that quarter without taking the necessary prerequisites in previous quarters. Make sure you have all prereqs of a certain color in your plan.`,
                                    cancelButton: 'Go back',
                                    confirmButton: 'Add anyway',
                                    confirmButtonColor: 'red',
                                    iconBackgroundColor: 'red',
                                    icon: (<ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />),
                                    action: () => {
                                        data[year][quarter].push(course);
                                        data[year][quarter].sort((a, b) => {
                                            return a.id.localeCompare(b.id);
                                        });
                                        this.setState({data: data});
                                        Utility.saveData(data);
                                    }

                                })
                            } else {
                                data[year][quarter].push(course);
                                data[year][quarter].sort((a, b) => {
                                    return a.id.localeCompare(b.id);
                                });
                                this.setState({data: data});
                                Utility.saveData(data);
                            }

                            
                        }}/>
                    </div>
                    
                    <Content content={this.state.data} delClass={(courseIndex, year, quarter) => {
                        let data = this.state.data;
                        data[year][quarter].splice(courseIndex, 1);
                        this.setState({data: data});
                        Utility.saveData(data);
                    }}/>
                </div>
            </div>
        );
    }

}

export default App;