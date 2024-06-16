import { useApp, useData, useModification } from '@/app/Context';
import { getTotalCredits } from '@/app/Plan';
import { convertYear } from '@/utility/Utility';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PlanTaskbarButton from './PlanTaskbarButton';
import Year from './Year';

export default function Content() {
  const { alert } = useApp();
  const { plan } = useData();
  const { planModification } = useModification();

  let years: JSX.Element[] = [];
  if (plan.courses) {
    years = plan.courses.map((year, index) => {
      return (
        <Year data={year} year={index} title={convertYear(index)} key={index} />
      );
    });
  }

  const units = getTotalCredits(plan);

  let unitString = 'units';
  if (units === 1) {
    unitString = 'unit';
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {years}
      <div className="m-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="w-48 rounded-lg border-2 border-gray-200 p-1 shadow-sm dark:border-gray-600">
          <p className="text-center text-sm font-light text-gray-400 dark:text-gray-400">
            <span className="font-medium">{units}</span> total {unitString}
          </p>
        </div>
        <div className="flex gap-4">
          {plan.courses.length < 10 && (
            <PlanTaskbarButton
              onClick={() => {
                alert({
                  title: 'Add a year?',
                  message:
                    'This will add another year to your plan. You can remove it by opening the year\'s menu and clicking "Delete year".',
                  confirmButton: 'Add year',
                  cancelButton: 'Close',
                  color: 'cyan',
                  icon: PlusIcon,
                  action: () => {
                    planModification.addYear();
                  },
                });
              }}
            >
              Add year
            </PlanTaskbarButton>
          )}
          <PlanTaskbarButton
            onClick={() => {
              alert({
                title: 'Clear plan?',
                message:
                  'All of your current plan data, which includes everything for each year and everything in your bookmarks, will be cleared. Make sure to save any data you want to keep.',
                color: 'red',
                icon: TrashIcon,
                cancelButton: 'Cancel',
                confirmButton: 'Clear',
                action: () => {
                  planModification.clearData();
                },
              });
            }}
          >
            Clear plan
          </PlanTaskbarButton>
        </div>
      </div>
    </motion.div>
  );
}
