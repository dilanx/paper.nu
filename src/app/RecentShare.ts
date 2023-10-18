import localforage from 'localforage';
import { RecentShareItem } from '../types/AccountTypes';

export async function updateRecentShare(item: RecentShareItem, remove = false) {
  const recentShare =
    (await localforage.getItem<RecentShareItem[]>('recent_share')) || [];
  const newRecentShare = recentShare.filter(
    (i) => i.shortCode !== item.shortCode
  );
  if (!remove) {
    newRecentShare.unshift(item);
  }

  await localforage.setItem('recent_share', newRecentShare);

  return newRecentShare;
}
