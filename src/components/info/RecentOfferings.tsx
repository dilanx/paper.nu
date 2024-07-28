import { useApp } from '@/app/Context';
import { getOfferings, getOfferingsOrganized } from '@/app/Plan';
import { Course } from '@/types/PlanTypes';
import { objAsAlertExtras } from '@/utility/Utility';
import { ChevronRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

interface RecentOfferingsProps {
  course: Course;
}

export default function RecentOfferings({ course }: RecentOfferingsProps) {
  const app = useApp();
  const offerings = getOfferings(course).slice(0, 8);

  return (
    <>
      <p className="text-sm">
        {offerings.length > 0 ? offerings.join(', ') : 'Not offered recently'}
      </p>
      <button
        className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-purple-500 active:text-purple-600 dark:text-gray-500 dark:hover:text-purple-300 dark:active:text-purple-200"
        onClick={() => {
          app.alert({
            icon: Squares2X2Icon,
            title: 'Historic Offerings',
            subtitle: course.id,
            message: `All offerings for ${course.id} since 2020 Fall.`,
            color: 'purple',
            cancelButton: 'Close',
            extras: objAsAlertExtras(getOfferingsOrganized(course), (a, b) =>
              b.localeCompare(a)
            ),
          });
        }}
      >
        <span>VIEW ALL OFFERINGS</span>
        <ChevronRightIcon className="h-4 w-4 stroke-2" />
      </button>
    </>
  );
}
