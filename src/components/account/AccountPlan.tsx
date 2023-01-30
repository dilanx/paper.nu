import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  AccountModificationFunctions,
  Document,
} from '../../types/AccountTypes';
import ScheduleManager from '../../ScheduleManager';
import { getTermName } from '../../DataManager';

interface AccountPlanProps {
  id: string;
  plan: Document;
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
          props.active ? 'border-emerald-400 ' : 'border-rose-400'
        }  group my-4 w-full transform cursor-default rounded-lg px-4 py-2
            text-left text-black transition duration-300 ease-in-out hover:-translate-y-1
            hover:shadow-md active:opacity-50 dark:bg-gray-800`}
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
        <div className="absolute -top-2 -right-2 flex overflow-hidden rounded-lg">
          <button
            className="z-20 hidden bg-gray-200 px-1 py-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-sky-100 hover:text-sky-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-sky-400"
            onClick={(e) => {
              e.stopPropagation();
              props.fa.rename(id, plan.name);
            }}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="z-20 hidden bg-gray-200 px-1 py-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-red-100 hover:text-red-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              props.fa.delete(id, plan.name);
            }}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
        {props.active ? (
          <p className="absolute -bottom-2 right-2 rounded-md bg-white px-1 text-xs font-bold text-emerald-400 transition-all duration-150 group-hover:shadow-sm dark:bg-gray-800">
            ACTIVE
          </p>
        ) : (
          !plan.content && (
            <p className="absolute -bottom-2 right-2 rounded-md bg-white px-1 text-xs font-bold text-rose-400 transition-all duration-150 group-hover:shadow-sm dark:bg-gray-800">
              EMPTY
            </p>
          )
        )}
      </div>
    </motion.div>
  );
}

export default AccountPlan;
