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
        className="inline-flex items-center rounded-sm px-1 py-0.5 text-xs font-bold text-gray-500 hover:bg-black/5 active:bg-black/10 dark:text-gray-400 dark:hover:bg-white/5 dark:active:bg-white/10"
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
