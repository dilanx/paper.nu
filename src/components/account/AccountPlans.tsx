import React from 'react';
import AccountPlanMessage from './AccountPlanMessage';
import {
    CollectionIcon,
    RefreshIcon,
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

interface AccountPlansProps {
    alert: Alert;
}

interface AccountPlansState {
    plans?: AccountPlansData;
    loading: boolean;
    loggedIn: boolean;
    fa: AccountModificationFunctions;
}

class AccountPlans extends React.Component<
    AccountPlansProps,
    AccountPlansState
> {
    constructor(props: AccountPlansProps) {
        super(props);

        let self = this;

        let fa: AccountModificationFunctions = {
            activatePlan: (planId: PlanId) => {
                self.activatePlan(planId);
            },
            deletePlan: (planId: PlanId, planName: string) => {
                self.deletePlan(planId, planName);
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
                .then(res => {
                    if (!res) return;
                    this.setState({
                        plans: res,
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

    createPlan() {
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
                focusByDefault: true,
            },
            action: name => {
                if (!name) {
                    self.props.alert(
                        Utility.errorAlert(
                            'account_create_plan',
                            'No Plan Name'
                        )
                    );
                    return;
                }
                self.setState({ loading: true });
                Account.createPlan(name)
                    .then(res => {
                        if (!res) return;
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

    deletePlan(planId: PlanId, planName: string) {
        let self = this;

        this.props.alert({
            title: 'Delete this plan?',
            message: `Are you sure you want to delete your plan named '${planName}' from your account? If it's active right now, it'll stay there, but it won't be linked to your account anymore.`,
            cancelButton: 'Cancel',
            confirmButton: 'Delete',
            confirmButtonColor: 'red',
            iconBackgroundColor: 'red',
            icon: (
                <TrashIcon
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
                                'account_delete_plan',
                                error.message
                            )
                        );
                    });
            },
        });
    }

    render() {
        let plans: JSX.Element[] = [];

        if (this.state.plans) {
            let self = this;
            plans = Object.keys(this.state.plans).map((planId, i) => {
                let plan = this.state.plans![planId];
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
                {!this.state.loggedIn ? (
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
                ) : this.state.loading ? (
                    <AccountPlanMessage
                        icon={
                            <RefreshIcon className="w-12 h-12 animate-reverse-spin" />
                        }
                        title="Almost ready..."
                        description="Your plans are loading."
                    />
                ) : plans.length === 0 ? (
                    <AccountPlanMessage
                        icon={<PlusIcon className="w-12 h-12" />}
                        title="Create your first plan"
                        description="Your account is all set up! Now, you can create your first plan.
                            Any current plan data you have loaded right now will stay, and you'll have the option to save it to your new plan."
                        button={{
                            text: 'Create a plan',
                            action: () => {
                                this.createPlan();
                            },
                        }}
                    />
                ) : (
                    <>
                        <div className="block m-4">{plans}</div>
                    </>
                )}
            </div>
        );
    }
}

export default AccountPlans;
