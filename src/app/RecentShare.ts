import { RecentShareItem } from '@/types/AccountTypes';
import { AppType } from '@/types/BaseTypes';
import { discardChanges, discardNotesChanges } from './AccountModification';

export function updateRecentShare(shortCode: string, item?: RecentShareItem) {
  const recentShare = JSON.parse(
    localStorage.getItem('recent_share') || '[]'
  ) as RecentShareItem[];
  const newRecentShare = recentShare.filter((i) => i.shortCode !== shortCode);
  if (item) {
    newRecentShare.unshift(item);
  }

  if (newRecentShare.length > 50) {
    newRecentShare.pop();
  }

  localStorage.setItem('recent_share', JSON.stringify(newRecentShare));

  return newRecentShare;
}

export function getRecentShare() {
  return JSON.parse(
    localStorage.getItem('recent_share') || '[]'
  ) as RecentShareItem[];
}

export function activateRecentShare(app: AppType, shortCode: string) {
  discardChanges(app, () => {
    discardNotesChanges(
      app.state.userOptions,
      (alertData) => app.showAlert(alertData),
      () => {
        app.state.userOptions.set('notes', false);
        app.state.userOptions.set('unsaved_notes', false);
        app.setState({ loadingLogin: true });
        app.initialize(
          () => {
            app.setState({ loadingLogin: false });
          },
          {
            hash: `#${shortCode}`,
          }
        );
      }
    );
  });
}

export function removeRecentShareHistory(app: AppType, shortCode: string) {
  app.setState({
    recentShare: updateRecentShare(shortCode),
  });
}
