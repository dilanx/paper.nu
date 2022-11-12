import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  AccountModificationFunctions,
  AccountData,
} from '../../types/AccountTypes';
import ScheduleManager from '../../ScheduleManager';
import { getTermName } from '../../DataManager';

interface AccountPlanProps {
  id: string;
  plan: AccountData;
  fa: AccountModificationFunctions;
  active: boolean;
}

const variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

function AccountPlan(props: AccountPlanProps) {
  let id = props.id;
  let plan = props.plan;
  const termId = ScheduleManager.getTermFromDataString(plan.content);
  const termName = termId ? getTermName(termId) : undefined;

  return (
    <motion.div variants={variants}>
      <div
        tabIndex={0}
        className={`block border-2 ${
          props.active
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-rose-400 bg-rose-50'
        }  dark:bg-gray-800 w-full my-4 text-left px-4 py-8 rounded-lg text-black
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1
            active:opacity-50 group cursor-pointer`}
        onClick={() => {
          if (props.active) {
            props.fa.deactivate();
          } else {
            props.fa.activate(id);
          }
        }}
      >
        <p className="text-lg font-semibold text-black dark:text-white">
          {plan.name.toUpperCase()}
        </p>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {termId ? (termName ? termName : 'unknown term') + ' • ' : ''}last
          updated{' '}
          {plan.lastUpdated
            ? new Date(plan.lastUpdated).toLocaleDateString()
            : 'N/A'}
        </p>
        <div className="absolute -top-2 -right-2 flex rounded-full overflow-hidden">
          <button
            className="px-1 py-0.5 bg-gray-200 hover:bg-sky-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-sky-400 dark:hover:text-sky-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
            onClick={(e) => {
              e.stopPropagation();
              props.fa.rename(id, plan.name);
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            className="px-1 py-0.5 bg-gray-200 hover:bg-red-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
            onClick={(e) => {
              e.stopPropagation();
              props.fa.delete(id, plan.name);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        {props.active ? (
          <p className="absolute bottom-1 right-2 font-bold text-green-400">
            ACTIVE
          </p>
        ) : (
          !plan.content && (
            <p className="absolute bottom-1 right-2 font-bold text-rose-300">
              EMPTY
            </p>
          )
        )}
      </div>
    </motion.div>
  );
}

export default AccountPlan;
