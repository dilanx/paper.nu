import { Document } from '@/types/AccountTypes';
import { Alert } from '@/types/AlertTypes';
import { AppType, UserOptions } from '@/types/BaseTypes';
import { PlanData, SerializedPlanData } from '@/types/PlanTypes';
import { ScheduleData, SerializedScheduleData } from '@/types/ScheduleTypes';
import { Mode } from '@/utility/Constants';
import { PaperError } from '@/utility/PaperError';
import { errorAlert } from '@/utility/Utility';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import toast from 'react-hot-toast';
import {
  getDocument,
  getPlanName,
  getScheduleName,
  updateDocument,
} from './Account';
import { loadPlan, savePlan, serializePlan } from './Plan';
import { loadSchedule, saveSchedule, serializeSchedule } from './Schedule';
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
          errorAlert(
            `account_activate_${errText}`,
            new PaperError('Undefined Document List')
          )
        );
        return;
      }

      const item = docs.find((doc) => doc.id === id);
      if (!item) {
        app.showAlert(
          errorAlert(
            `account_activate_${errText}`,
            new PaperError('Undefined Document')
          )
        );
        return;
      }

      if (!item.data) {
        callback(item, 'empty');
        return;
      }

      discardChanges(app, () => {
        discardNotesChanges(
          app.state.userOptions,
          (alertData) => app.showAlert(alertData),
          () => {
            app.state.userOptions.set('notes', false);
            app.state.userOptions.set('unsaved_notes', false);
            app.setState({ loadingLogin: true });
            (isSchedule
              ? loadSchedule(item.data as SerializedScheduleData)
              : loadPlan(item.data as SerializedPlanData)
            ).then((data) => {
              if (data === 'malformed') {
                app.showAlert(
                  errorAlert(
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
      });
    })
    .catch((error: PaperError) => {
      app.showAlert(errorAlert(`account_activate_${errText}`, error));
    });
}

export function activateAccountPlan(app: AppType, planId: string) {
  d('plan activating: %s', planId);
  activate(app, getDocument('plans'), planId, false, (item, data) => {
    if (data === 'empty') {
      app.state.userOptions.set('active_plan_id', planId, true);
      app.state.userOptions.set('notes', false);
      app.state.userOptions.set('unsaved_notes', false);
      app.setState({
        saveState: 'start',
        loadingLogin: false,
      });
      toast.success('Activated plan: ' + getPlanName(planId));
      d('plan activated: %s (empty)', planId);
      return;
    }

    app.state.userOptions.set('active_plan_id', planId, true);
    app.setState(
      {
        data: data as PlanData,
        loadingLogin: false,
      },
      () => {
        savePlan(data as PlanData, app.state.userOptions);
        toast.success('Activated plan: ' + getPlanName(planId));
        d('plan activated: %s', planId);
      }
    );
  });
}

export function activateAccountSchedule(app: AppType, scheduleId: string) {
  d('schedule activating: %s', scheduleId);
  activate(app, getDocument('schedules'), scheduleId, true, (item, data) => {
    if (data === 'empty') {
      app.state.userOptions.set('active_schedule_id', scheduleId, true);
      app.setState({
        saveState: 'start',
        loadingLogin: false,
      });
      toast.success('Activated schedule: ' + getScheduleName(scheduleId));
      d('schedule activated: %s (empty)', scheduleId);
      return;
    }

    app.state.userOptions.set('active_schedule_id', scheduleId, true);
    app.setState(
      {
        schedule: data as ScheduleData,
        loadingLogin: false,
      },
      () => {
        saveSchedule(data as ScheduleData, app.state.userOptions);
        toast.success('Activated schedule: ' + getScheduleName(scheduleId));
        d('schedule activated: %s', scheduleId);
      }
    );
  });
}

export function deactivate(app: AppType) {
  const t =
    app.state.userOptions.get.mode === Mode.SCHEDULE ? 'schedule' : 'plan';
  discardChanges(app, () => {
    discardNotesChanges(
      app.state.userOptions,
      (alertData) => app.showAlert(alertData),
      () => {
        app.state.userOptions.set('notes', false);
        app.state.userOptions.set('unsaved_notes', false);
        const id = app.state.userOptions.get[`active_${t}_id`];
        app.state.userOptions.set(`active_${t}_id`, 'None', true);
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
  const activeId = app.state.userOptions.get[`active_${t}_id`];
  if (!activeId || activeId === 'None') {
    app.showAlert(
      errorAlert(`account_update_${t}`, new PaperError('Nothing Active'))
    );
    return;
  }

  const sData = isSchedule
    ? serializeSchedule(app.state.schedule)
    : serializePlan(app.state.data);
  app.setState({ saveState: 'save' });

  updateDocument(isSchedule ? 'schedules' : 'plans', activeId as string, {
    data: sData,
  })
    .then(() => {
      app.setState({
        saveState: 'idle',
      });
    })
    .catch((err: PaperError) => {
      app.setState({
        saveState: 'error',
      });
      app.showAlert(errorAlert(`account_update_${t}`, err));
    });
}

export function discardChanges(app: AppType, action: () => void) {
  if (app.state.saveState !== 'idle') {
    app.showAlert({
      title: 'Hold on...',
      message:
        'It looks like you have some unsaved changes. Navigating away will cause them not to be saved to your account. Are you sure?',
      confirmButton: 'Yes, continue',
      cancelButton: 'Go back',
      color: 'red',
      icon: ExclamationTriangleIcon,
      action: () => {
        app.setState({ saveState: 'idle' });
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
