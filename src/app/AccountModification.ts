import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import toast from 'react-hot-toast';
import Account from '../Account';
import PlanManager from '../PlanManager';
import ScheduleManager from '../ScheduleManager';
import { AccountData, AccountDataMap } from '../types/AccountTypes';
import { AppType } from '../types/BaseTypes';
import { PlanData } from '../types/PlanTypes';
import { ScheduleData } from '../types/ScheduleTypes';
import PlanError from '../utility/PlanError';
import Utility from '../utility/Utility';
var d = debug('app:account-mod');

function activate(
  app: AppType,
  req: Promise<AccountDataMap | undefined>,
  id: string,
  isSchedule: boolean,
  callback: (item: AccountData, data: PlanData | ScheduleData | 'empty') => void
) {
  const errText = isSchedule ? 'schedule' : 'plan';
  req
    .then((map) => {
      if (!map) {
        app.setState({
          alertData: Utility.errorAlert(
            `account_activate_${errText}`,
            'Undefined Map'
          ),
        });
        return;
      }

      const item = map[id];
      if (!item) {
        app.setState({
          alertData: Utility.errorAlert(
            `account_activate_${errText}`,
            'Undefined Item'
          ),
        });
        return;
      }

      (isSchedule ? ScheduleManager : PlanManager)
        .loadFromString(item.content)
        .then((data) => {
          if (data === 'malformed') {
            app.setState({
              alertData: Utility.errorAlert(
                `account_activate_${errText}`,
                'Malformed Data'
              ),
            });
            return;
          }

          callback(item, data);
        });
    })
    .catch((error: PlanError) => {
      app.setState({
        alertData: Utility.errorAlert(
          `account_activate_${errText}`,
          error.message
        ),
      });
    });
}

export function activateAccountPlan(app: AppType, planId: string) {
  d('plan activating: %s', planId);
  activate(app, Account.getPlans(), planId, false, (item, data) => {
    if (data === 'empty') {
      app.state.switches.set('active_plan_id', planId, true);
      app.setState({
        originalDataString: item.content,
        unsavedChanges: window.location.search.length > 0,
      });
      toast.success('Activated plan: ' + Account.getPlanName(planId));
      d('plan activated: %s (empty)', planId);
      return;
    }

    let confirmNonAccountOverwrite =
      app.state.switches.get.active_plan_id === 'None' &&
      window.location.search.length > 0;

    discardChanges(
      app,
      () => {
        app.state.switches.set('active_plan_id', planId, true);
        app.setState(
          {
            data: data as PlanData,
            originalDataString: item.content,
          },
          () => {
            PlanManager.save(data as PlanData);
            toast.success('Activated plan: ' + Account.getPlanName(planId));
            d('plan activated: %s', planId);
          }
        );
      },
      confirmNonAccountOverwrite
    );
  });
}

export function activateAccountSchedule(app: AppType, scheduleId: string) {
  d('schedule activating: %s', scheduleId);
  activate(app, Account.getSchedules(), scheduleId, true, (item, data) => {
    if (data === 'empty') {
      app.state.switches.set('active_schedule_id', scheduleId, true);
      app.setState({
        originalDataString: item.content,
        unsavedChanges: window.location.search.length > 0,
      });
      toast.success(
        'Activated schedule: ' + Account.getScheduleName(scheduleId)
      );
      d('schedule activated: %s (empty)', scheduleId);
      return;
    }

    let confirmNonAccountOverwrite =
      app.state.switches.get.active_schedule_id === 'None' &&
      window.location.search.length > 0;

    discardChanges(
      app,
      () => {
        app.state.switches.set('active_schedule_id', scheduleId, true);
        app.setState(
          {
            schedule: data as ScheduleData,
            originalDataString: item.content,
          },
          () => {
            ScheduleManager.save(data as ScheduleData);
            toast.success(
              'Activated schedule: ' + Account.getScheduleName(scheduleId)
            );
            d('schedule activated: %s', scheduleId);
          }
        );
      },
      confirmNonAccountOverwrite
    );
  });
}

export function deactivate(app: AppType, isSchedule: boolean) {
  const t = isSchedule ? 'schedule' : 'plan';
  discardChanges(app, () => {
    let id = app.state.switches.get[`active_${t}_id`];
    app.state.switches.set(`active_${t}_id`, 'None', true);
    toast.success(`Deactivated ${t}`, {
      iconTheme: {
        primary: 'red',
        secondary: 'white',
      },
    });
    d('%s deactivated: %s', t, id);
  });
}

export function update(app: AppType, isSchedule: boolean) {
  const t = isSchedule ? 'schedule' : 'plan';
  let activeId = app.state.switches.get[`active_${t}_id`];
  if (!activeId || activeId === 'None') {
    app.setState({
      alertData: Utility.errorAlert(`account_update_${t}`, 'Nothing Active'),
    });
    return;
  }

  const dataStr = isSchedule
    ? ScheduleManager.getDataString(app.state.schedule)
    : PlanManager.getDataString(app.state.data);
  app.setState({ unsavedChanges: false });

  toast.promise(
    (isSchedule ? Account.updateSchedule : Account.updatePlan)(
      activeId as string,
      dataStr
    ),
    {
      loading: 'Saving...',
      success: () => {
        app.setState({
          originalDataString: dataStr,
        });
        return (
          'Saved ' +
          (isSchedule ? Account.getScheduleName : Account.getPlanName)(
            activeId as string
          )
        );
      },
      error: (err) => {
        app.setState({
          unsavedChanges: true,
          alertData: Utility.errorAlert(`account_update_${t}`, err.message),
        });
        return 'Something went wrong';
      },
    }
  );
}

export function discardChanges(
  app: AppType,
  action: () => void,
  confirmNonAccountOverwrite: boolean = false
) {
  let message = confirmNonAccountOverwrite
    ? 'Activating this will overwrite any data currently in use. Are you sure?'
    : 'It looks like you have some unsaved changes. Navigating away will cause them not to be saved to your account. Are you sure?';

  if (confirmNonAccountOverwrite || app.state.unsavedChanges) {
    app.setState({
      alertData: {
        title: 'Hold on...',
        message,
        confirmButton: 'Yes, continue',
        confirmButtonColor: 'red',
        cancelButton: 'Go back',
        iconColor: 'red',
        icon: ExclamationTriangleIcon,
        action: () => {
          app.setState({ unsavedChanges: false });
          action();
        },
      },
    });
    return;
  }

  action();
}
