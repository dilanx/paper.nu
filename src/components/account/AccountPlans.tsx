import React from 'react';
import AccountPlan from './AccountPlan';
import AccountPlanMessage from './AccountPlanMessage';
import {
    CollectionIcon,
    RefreshIcon,
    ExclamationIcon,
} from '@heroicons/react/outline';
import Account from '../../Account';

class Plans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            plans: [],
            loading: true,
            loggedIn: false,
        };
    }

    componentDidMount() {
        if (Account.isLoggedIn()) {
            this.setState({ loggedIn: true });
            Account.getPlans().then(response => {
                if (response.error) {
                    // TODO add error message here
                    return;
                }

                this.setState({
                    plans: response,
                    loading: false,
                    loggedIn: true,
                });
            });
        }
    }

    render() {
        let plans = null;

        if (this.state.plans) {
            let self = this;
            plans = Object.keys(this.state.plans).map((planId, i) => {
                let plan = this.state.plans[planId];
                return (
                    <AccountPlan
                        name={plan.name}
                        lastUpdated={plan.lastUpdated}
                        delPlan={() => {
                            this.props.alert({
                                title: 'Delete this plan?',
                                message: `Are you sure you want to delete ${plan.name} from your account? If it's active right now, it'll stay there, but it won't be linked to your account anymore.`,
                                cancelButton: 'Cancel',
                                confirmButton: 'Delete',
                                confirmButtonColor: 'red',
                                iconBackgroundColor: 'red',
                                icon: (
                                    <ExclamationIcon
                                        className="h-6 w-6 text-red-600"
                                        aria-hidden="true"
                                    />
                                ),
                                action: () => {
                                    self.setState({ loading: true });
                                    Account.delPlan(planId).then(response => {
                                        if (response.error) {
                                            // TODO add error message here
                                            return;
                                        }

                                        self.setState({
                                            plans: response,
                                        });
                                    });
                                },
                            });
                        }}
                        key={`plan-${i}`}
                    />
                );
            });
        }

        return (
            <div
                className="border-4 border-rose-300 my-2 rounded-lg shadow-lg h-full
            overflow-y-scroll no-scrollbar"
            >
                <p className="text-center text-2xl text-rose-300 font-bold my-4">
                    PLANS
                </p>
                {!this.state.loggedIn && (
                    <AccountPlanMessage
                        icon={<CollectionIcon className="w-12 h-12" />}
                        title="Save your plans"
                        description="By creating an account, you can save up to 5 plans and access them from any device at any time. It's super simple."
                        button={{
                            text: 'Log in',
                            action: () => {
                                Account.login();
                            },
                        }}
                    />
                )}
                {this.state.loading && (
                    <AccountPlanMessage
                        icon={
                            <RefreshIcon className="w-12 h-12 animate-spin" />
                        }
                        title="Almost ready..."
                        description="Your plans are loading."
                    />
                )}
                {!this.state.loading && (
                    <div className="block m-4">{plans}</div>
                )}
            </div>
        );
    }
}

export default Plans;
