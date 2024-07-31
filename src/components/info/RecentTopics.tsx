import { useApp } from '@/app/Context';
import { getTermName } from '@/app/Data';
import { getRecentTopics, getTopicsOrganized } from '@/app/Plan';
import { Course } from '@/types/PlanTypes';
import { objAsAlertExtras } from '@/utility/Utility';
import { ChevronRightIcon, TagIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

interface RecentTopicsProps {
  course: Course;
}

export default function RecentTopics({ course }: RecentTopicsProps) {
  const app = useApp();
  const topics = useMemo(
    () => getRecentTopics(course)?.slice(0, 4) || [],
    [course]
  );

  return (
    <>
      <p className="text-sm">{topics.map((t) => t[0]).join(', ')}</p>
      <button
        className="inline-flex items-center rounded-sm px-1 py-0.5 text-xs font-bold text-gray-500 hover:bg-black/5 active:bg-black/10 dark:text-gray-400 dark:hover:bg-white/5 dark:active:bg-white/10"
        onClick={() => {
          app.alert({
            icon: TagIcon,
            title: 'Course Topics',
            subtitle: course.id,
            message: `All course topics offered for ${course.id} since 2020 Fall.`,
            color: 'green',
            cancelButton: 'Close',
            extras: objAsAlertExtras(
              getTopicsOrganized(course),
              (a, b) => parseInt(b) - parseInt(a),
              (t) => getTermName(t) || 'Unknown Term'
            ),
          });
        }}
      >
        <span>VIEW ALL TOPIC DETAILS</span>
        <ChevronRightIcon className="h-4 w-4 stroke-2" />
      </button>
    </>
  );
}
