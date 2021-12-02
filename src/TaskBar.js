import React from 'react';
import { SaveIcon, PlusIcon, InformationCircleIcon, ExclamationIcon } from '@heroicons/react/outline';

function TaskBarButton(props) {
    return (
        <button className={`border-2 rounded-md border-gray-400 bg-gray-50 text-gray-600
        hover:border-${props.color}-500 hover:bg-${props.color}-50 hover:text-${props.color}-500
        transition-all duration-150`} onClick={() => {
            props.action();
        }}>
            {props.name}
        </button>
    )
}

class TaskBar extends React.Component {

    render() {
        return (

            <div className="grid grid-cols-3 px-4 gap-4 text-xs">

                <TaskBarButton name="About" color="purple" action={() => {

                    this.props.alert({
                        title: 'Plan Northwestern',
                        subtitle: `version ${this.props.version} by Dilan N`,
                        message: 'An easy and organized way to plan out your classes at Northwestern. Currently in beta with a temporary URL. Data is all saved in the URL, so save the link to your plan to access it later or share with friends. Notice any errors with classes? Check out the GitHub repository for instructions on reporting/fixing.',
                        confirmButton: 'View on GitHub',
                        confirmButtonColor: 'purple',
                        cancelButton: 'Close',
                        iconBackgroundColor: 'purple',
                        icon: (<InformationCircleIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />),
                        action: () => {
                            window.open('https://github.com/dilanx/plan-northwestern', '_blank');
                        }

                    })

                }}/>

                <TaskBarButton name="Save / Share" color="emerald" action={() => {
                    this.props.alert({
                        title: 'Ready to share!',
                        message: 'All of your plan data is stored in the URL. When you make changes to your plan, the URL is updated to reflect those changes. Save it somewhere, or share with a friend!',
                        confirmButton: 'Copy to clipboard',
                        confirmButtonColor: 'emerald',
                        cancelButton: 'Close',
                        iconBackgroundColor: 'emerald',
                        icon: (<SaveIcon className="h-6 w-6 text-emerald-600" aria-hidden="true" />),
                        textView: window.location.href,
                        action: () => {
                            navigator.clipboard.writeText(window.location.href);
                        }
                    });
                }}/>

                <TaskBarButton name="Add Year" color="cyan" action={() => {
                    if (this.props.allowAddYear) {
                        this.props.alert({
                            title: 'Add a year?',
                            message: 'This will add another year to your plan. You can remove it by removing all classes from that year and refreshing the page.',
                            confirmButton: 'Add year',
                            confirmButtonColor: 'cyan',
                            cancelButton: 'Close',
                            iconBackgroundColor: 'cyan',
                            icon: (<PlusIcon className="h-6 w-6 text-cyan-600" aria-hidden="true" />),
                            action: () => {
                                this.props.addYear();
                            }
                        });
                    } else {
                        this.props.alert({
                            title: `Can't add another year :(`,
                            message: `You can't add more than 10 years.`,
                            confirmButton: 'Close',
                            confirmButtonColor: 'cyan',
                            iconBackgroundColor: 'cyan',
                            icon: (<ExclamationIcon className="h-6 w-6 text-cyan-600" aria-hidden="true" />),
                        });
                    }
                }}/>

                {/* <TaskBarButton name="Settings" color="blue" action={() => {
                    this.props.alert({
                        title: 'Settings',
                        message: `Features like summer classes, more than 4 years, and more are coming soon. Oh also, I found this cool library for drag-and-drop online so I hope to make it possible to drag courses into the quarter you want.`,
                        confirmButton: 'Close',
                        confirmButtonColor: 'blue',
                        iconBackgroundColor: 'blue',
                        icon: (<CogIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />),
                    })
                }}/> */}

                


            </div>
        )
    }

}

export default TaskBar;