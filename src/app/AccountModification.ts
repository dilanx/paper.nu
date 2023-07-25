import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import toast from 'react-hot-toast';
import Account from '../Account';
import PlanManager from '../PlanManager';
import ScheduleManager from '../ScheduleManager';
import { Document } from '../types/AccountTypes';
import { Alert } from '../types/AlertTypes';
import { AppType, UserOptions } from '../types/BaseTypes';
import { PlanData } from '../types/PlanTypes';
import { ScheduleData } from '../types/ScheduleTypes';
import { PaperError } from '../utility/PaperError';
import Utility from '../utility/Utility';
const d = debug('app:account-mod');

function activate(
  app: AppType,
  req: Promise<Document[] | undefined>,
  id: string,
  isSchedule: boolean,
  callback: (item: Document, data: PlanData | ScheduleData | 'empty') => void
) {
  app.closeSideCard();
  const errText = isSchedule ? 'schedule' : 'plan';
  req
    .then((docs) => {
      if (!docs) {
        app.showAlert(
          Utility.errorAlert(
            `account_activate_${errText}`,
            new PaperError('Undefined Document List')
          )
        );
        return;
      }

      const item = docs.find((doc) => doc.id === id);
      if (!item) {
        app.showAlert(
          Utility.errorAlert(
            `account_activate_${errText}`,
            new PaperError('Undefined Document')
          )
        );
        return;
      }

      if (!item.content) {
        callback(item, 'empty');
        return;
      }

      let confirmNonAccountOverwrite =
        app.state.switches.get[
          `active_${isSchedule ? 'schedule' : 'plan'}_id`
        ] === 'None' && window.location.search.length > 0;

      discardChanges(
        app,
        () => {
          discardNotesChanges(
            app.state.switches,
            (alertData) => app.showAlert(alertData),
            () => {
              app.state.switches.set('notes', false);
              app.state.switches.set('unsaved_notes', false);
              app.setState({ loadingLogin: true });
              (isSchedule ? ScheduleManager : PlanManager)
                .loadFromString(item.content)
                .then((data) => {
                  if (data === 'malformed') {
                    app.showAlert(
                      Utility.errorAlert(
                        `account_activate_${errText}`,
                        new PaperError('Malformed Data')
                      )
                    );
                    return;
                  }

                  callback(item, data);
                });
            }
          );
        },
        confirmNonAccountOverwrite
      );
    })
    .catch((error: PaperError) => {
      app.showAlert(Utility.errorAlert(`account_activate_${errText}`, error));
    });
}

export function activateAccountPlan(app: AppType, planId: string) {
  d('plan activating: %s', planId);
  activate(app, Account.get('plans'), planId, false, (item, data) => {
    if (data === 'empty') {
      app.state.switches.set('active_plan_id', planId, true);
      app.state.switches.set('notes', false);
      app.state.switches.set('unsaved_notes', false);
      app.setState({
        originalDataString: item.content,
        unsavedChanges: window.location.search.length > 0,
      });
      toast.success('Activated plan: ' + Account.getPlanName(planId));
      d('plan activated: %s (empty)', planId);
      return;
    }

    app.state.switches.set('active_plan_id', planId, true);
    app.setState(
      {
        data: data as PlanData,
        originalDataString: item.content,
        loadingLogin: false,
      },
      () => {
        PlanManager.save(data as PlanData, app.state.switches);
        toast.success('Activated plan: ' + Account.getPlanName(planId));
        d('plan activated: %s', planId);
      }
    );
  });
}

export function activateAccountSchedule(app: AppType, scheduleId: string) {
  d('schedule activating: %s', scheduleId);
  activate(app, Account.get('schedules'), scheduleId, true, (item, data) => {
    if (data === 'empty') {
      app.state.switches.set('active_schedule_id', scheduleId, true);
      app.setState({
        originalDataString: item.content,
        unsavedChanges: window.location.search.length > 0,
        loadingLogin: false,
      });
      toast.success(
        'Activated schedule: ' + Account.getScheduleName(scheduleId)
      );
      d('schedule activated: %s (empty)', scheduleId);
      return;
    }

    app.state.switches.set('active_schedule_id', scheduleId, true);
    app.setState(
      {
        schedule: data as ScheduleData,
        originalDataString: item.content,
        loadingLogin: false,
      },
      () => {
        ScheduleManager.save(data as ScheduleData, app.state.switches);
        toast.success(
          'Activated schedule: ' + Account.getScheduleName(scheduleId)
        );
        d('schedule activated: %s', scheduleId);
      }
    );
  });
}

export function deactivate(app: AppType, isSchedule: boolean) {
  const t = isSchedule ? 'schedule' : 'plan';
  discardChanges(app, () => {
    discardNotesChanges(
      app.state.switches,
      (alertData) => app.showAlert(alertData),
      () => {
        app.state.switches.set('notes', false);
        app.state.switches.set('unsaved_notes', false);
        let id = app.state.switches.get[`active_${t}_id`];
        app.state.switches.set(`active_${t}_id`, 'None', true);
        toast.success(`Deactivated ${t}`, {
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        });
        d('%s deactivated: %s', t, id);
      }
    );
  });
}

export function update(app: AppType, isSchedule: boolean) {
  const t = isSchedule ? 'schedule' : 'plan';
  let activeId = app.state.switches.get[`active_${t}_id`];
  if (!activeId || activeId === 'None') {
    app.showAlert(
      Utility.errorAlert(
        `account_update_${t}`,
        new PaperError('Nothing Active')
      )
    );
    return;
  }

  const dataStr = isSchedule
    ? ScheduleManager.getDataString(app.state.schedule)
    : PlanManager.getDataString(app.state.data);
  app.setState({ unsavedChanges: false });

  toast.promise(
    Account.update(isSchedule ? 'schedules' : 'plans', activeId as string, {
      content: dataStr,
    }),
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
      error: (err: PaperError) => {
        app.setState({
          unsavedChanges: true,
        });
        app.showAlert(Utility.errorAlert(`account_update_${t}`, err));
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
    app.showAlert({
      title: 'Hold on...',
      message,
      confirmButton: 'Yes, continue',
      cancelButton: 'Go back',
      color: 'red',
      icon: ExclamationTriangleIcon,
      action: () => {
        app.setState({ unsavedChanges: false });
        action();
      },
    });
    return;
  }

  action();
}

export function discardNotesChanges(
  switches: UserOptions,
  alert: Alert,
  onClose: () => void
) {
  if (switches.get.unsaved_notes) {
    alert({
      title: 'Hold on...',
      message:
        'It looks like you have some unsaved changes to your notes. Navigating away will discard them. Are you sure?',
      confirmButton: 'Yes, continue',
      cancelButton: 'Go back',
      color: 'red',
      icon: ExclamationTriangleIcon,
      action: () => {
        onClose();
      },
    });
    return;
  }
  onClose();
}
