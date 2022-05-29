import React from 'react';
import AccountPlanData from './AccountPlan';
import AccountPlanMessage from './AccountPlanMessage';
import {
    CollectionIcon,
    RefreshIcon,
    ExclamationIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import Account from '../../Account';
import {
    AccountModificationFunctions,
    AccountPlansData,
    PlanId,
} from '../../types/AccountTypes';
import { Alert } from '../../types/AlertTypes';
import Utility from '../../Utility';
import AccountPlan from './AccountPlan';
import PlanError from '../../classes/PlanError';

interface PlansProps {
    alert: Alert;
}

interface PlansState {
    plans?: AccountPlansData;
    loading: boolean;
    loggedIn: boolean;
    fa: AccountModificationFunctions;
}

class Plans extends React.Component<PlansProps, PlansState> {
    constructor(props: PlansProps) {
        super(props);

        let self = this;

        let fa: AccountModificationFunctions = {
            activatePlan: (planId: PlanId) => {
                self.activatePlan(planId);
            },
            removePlan: (planId: PlanId, planName: string) => {
                self.removePlan(planId, planName);
            },
        };

        this.state = {
            loading: true,
            loggedIn: false,
            fa,
        };
    }

    componentDidMount() {
        if (Account.isLoggedIn()) {
            this.setState({ loggedIn: true });
            Account.getPlans()
                .then(response => {
                    this.setState({
                        plans: response,
                        loading: false,
                        loggedIn: true,
                    });
                })
                .catch((error: PlanError) => {
                    this.props.alert(
                        Utility.errorAlert('account_get_plans', error.message)
                    );
                });
        }
    }

    activatePlan(planId: PlanId) {}

    addPlan() {
        let self = this;

        this.props.alert({
            title: 'Creating a new plan...',
            message: `Let's add a new plan to your account! You'll need to give it a name.`,
            cancelButton: 'Cancel',
            confirmButton: 'Create',
            confirmButtonColor: 'rose',
            iconBackgroundColor: 'rose',
            icon: (
                <PlusIcon
                    className="h-6 w-6 text-rose-600"
                    aria-hidden="true"
                />
            ),
            textInput: {
                placeholder: 'Name',
                match: /^[\w\-\s]{1,10}$/,
                matchError: 'Alphanumeric, hyphens and spaces, 1-10 chars',
            },
            action: name => {
                self.setState({ loading: true });
                Account.createPlan(name)
                    .then(res => {
                        self.setState({
                            plans: res,
                            loading: false,
                        });
                    })
                    .catch((error: PlanError) => {
                        self.props.alert(
                            Utility.errorAlert(
                                'account_create_plan',
                                error.message
                            )
                        );
                    });
            },
        });
    }

    removePlan(planId: PlanId, planName: string) {
        let self = this;

        this.props.alert({
            title: 'Delete this plan?',
            message: `Are you sure you want to delete ${planName} from your account? If it's active right now, it'll stay there, but it won't be linked to your account anymore.`,
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
                Account.deletePlan(planId)
                    .then(res => {
                        self.setState({
                            plans: res,
                            loading: false,
                        });
                    })
                    .catch((error: PlanError) => {
                        self.props.alert(
                            Utility.errorAlert(
                                'account_remove_plan',
                                error.message
                            )
                        );
                    });
            },
        });
    }

    render() {
        let plans = null;

        if (this.state.plans) {
            let self = this;
            plans = Object.keys(this.state.plans).map((planId, i) => {
                let plan = this.state.plans[planId];
                return (
                    <AccountPlan
                        id={planId}
                        plan={plan}
                        fa={self.state.fa}
                        key={`account-plan-${i}`}
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
                            <RefreshIcon className="w-12 h-12 animate-reverse-spin" />
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
