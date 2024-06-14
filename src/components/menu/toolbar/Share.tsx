import {
  DocumentDuplicateIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Alert } from '@/types/AlertTypes';
import {
  ContextMenuData,
  ContextMenuItem,
  UserOptions,
} from '@/types/BaseTypes';
import { PlanData } from '@/types/PlanTypes';
import { ScheduleData } from '@/types/ScheduleTypes';
import { Mode } from '@/utility/Constants';
import toast from 'react-hot-toast';
import Links from '@/utility/StaticLinks';
import debug from 'debug';
import { PaperError } from '@/utility/PaperError';
import {
  getPlan,
  getPlanName,
  getSchedule,
  getScheduleName,
  isLoggedIn,
  revokePersistent,
  sharePersistent,
} from '@/app/Account';
import { serializeSchedule } from '@/app/Schedule';
import { serializePlan } from '@/app/Plan';
const d = debug('share');

interface ShareMenuData {
  x: number;
  y: number;
  plan: PlanData;
  schedule: ScheduleData;
  alert: Alert;
  switches: UserOptions;
}

export const shareMenu = ({
  x,
  y,
  plan,
  schedule,
  alert,
  switches,
}: ShareMenuData): ContextMenuData => {
  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  const loggedIn = isLoggedIn();
  const active =
    (!isSchedule && switches.get.active_plan_id) ||
    (isSchedule && switches.get.active_schedule_id);
  const docText = isSchedule ? 'schedule' : 'plan';
  let shouldRevoke = false;

  if (active && active !== 'None') {
    if (isSchedule) {
      shouldRevoke = !!getSchedule(active)?.public;
    } else {
      shouldRevoke = !!getPlan(active)?.public;
    }
  }

  const items: ContextMenuItem[] = [
    {
      text: 'Share a copy',
      icon: DocumentDuplicateIcon,
      onClick: () => {
        async function generateShortLink() {
          const data = isSchedule
            ? serializeSchedule(schedule)
            : serializePlan(plan);

          const response = await fetch(`${Links.SERVER}/paper/share`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: isSchedule ? 2 : 1,
              data,
            }),
          });

          if (!response.ok) {
            throw new PaperError('Failed to generate share link');
          }

          const resData = await response.json();
          return `${window.location.origin}/#${resData.shortCode}`;
        }

        const id = toast.loading('Generating link...');

        d('generating share copy link for %s', docText);
        generateShortLink()
          .then((link) => {
            d('share copy link generated');
            toast.success('Link generated!', { id });
            alert({
              title: 'Ready to share!',
              message: `Others can use the link below to load a copy of your ${docText}! Notes are not shared, just the ${docText} itself along with any bookmarked courses. Any changes you make will not be reflected in the copy.`,
              confirmButton: 'Copy to clipboard',
              cancelButton: 'Close',
              color: 'sky',
              icon: DocumentDuplicateIcon,
              textView: {
                text: link,
              },
              action: ({ textViewValue }) => {
                if (!textViewValue) {
                  toast.error('Unable to copy URL');
                  return;
                }
                navigator.clipboard.writeText(textViewValue);
                toast.success('URL copied to clipboard');
              },
            });
          })
          .catch((err) => {
            d('failed to generate share copy link');
            console.error(err);
            toast.error('Failed to generate link', { id });
          });
      },
      description: `Share a copy of this ${docText}. Others will not see any changes you make.`,
    },
    {
      text: shouldRevoke ? 'View persistent share link' : 'Share persistent',
      icon: DocumentIcon,
      onClick: () => {
        async function generateShortLink() {
          if (!active || active === 'None') {
            throw new PaperError('No active document');
          }

          const response = await sharePersistent(
            isSchedule ? 'schedules' : 'plans',
            active
          );
          if (!response?.success) {
            throw new PaperError('Failed to generate persistent link');
          }
          return `${window.location.origin}/#${response.shortCode}`;
        }

        const id = toast.loading(
          shouldRevoke ? 'Retrieving link...' : 'Generating link...'
        );

        d('generating share persistent link for %s %s', docText, active);
        generateShortLink()
          .then((link) => {
            d('share persistent link generated');
            toast.success(
              shouldRevoke ? 'Link retrieved!' : 'Link generated!',
              { id }
            );
            const name = isSchedule
              ? getScheduleName(active as string)
              : getPlanName(active as string);
            alert({
              title: 'Ready to share!',
              message: `Others can use the link below to load your ${docText}, ${name}! Notes are not shared, just the ${docText} itself along with any bookmarked courses. They won't be able to edit it or anything, but they will see the latest version of it when they refresh. Revoke access at any time in the share menu.`,
              confirmButton: 'Copy to clipboard',
              cancelButton: 'Close',
              color: 'sky',
              icon: DocumentIcon,
              textView: {
                text: link,
              },
              action: ({ textViewValue }) => {
                if (!textViewValue) {
                  toast.error('Unable to copy URL');
                  return;
                }
                navigator.clipboard.writeText(textViewValue);
                toast.success('URL copied to clipboard');
              },
            });
          })
          .catch((err) => {
            d('failed to generate share persistent link');
            console.error(err);
            toast.error(
              shouldRevoke
                ? 'Failed to retrieve link'
                : 'Failed to generate link',
              { id }
            );
          });
      },
      description: `${
        shouldRevoke ? 'View your' : 'Share a'
      } link to this specific ${docText}. Others will always see the latest version. You can revoke access at any time.`,
      disabled: !loggedIn || !active || active === 'None',
      disabledReason: `You need to be logged in and have an active ${docText} to share persistent.`,
    },
  ];

  if (shouldRevoke) {
    items.push({
      text: 'Revoke persistent share link',
      danger: true,
      icon: XMarkIcon,
      onClick: () => {
        async function revokeAccess() {
          if (!active || active === 'None') {
            throw new PaperError('No active document');
          }

          const response = await revokePersistent(
            isSchedule ? 'schedules' : 'plans',
            active
          );
          if (!response?.success) {
            throw new PaperError('Failed to revoke persistent link');
          }
        }

        const id = toast.loading('Revoking link...');

        d('revoking share persistent link for %s %s', docText, active);
        revokeAccess()
          .then(() => {
            d('share persistent link revoked');
            toast.success(`Persistent share link revoked!`, {
              id,
              iconTheme: {
                primary: 'red',
                secondary: 'white',
              },
            });
          })
          .catch((err) => {
            d('failed to revoke share persistent link');
            console.error(err);
            toast.error('Failed to revoke link', { id });
          });
        return;
      },
    });
  }

  return {
    name: 'share',
    x,
    y,
    items,
  };
};
