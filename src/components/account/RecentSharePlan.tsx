import {
  RecentShareItem,
  RecentShareModificationFunctions,
} from '../../types/AccountTypes';
import { motion } from 'framer-motion';
import { Avatar } from '@dilanx/avatar';
import { getTermName } from '../../DataManager';
import { CheckIcon, LinkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface RecentSharePlanProps {
  data: RecentShareItem;
  rf: RecentShareModificationFunctions;
}

const variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export default function RecentSharePlan({ data, rf }: RecentSharePlanProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);

  return (
    <motion.div variants={variants}>
      <div
        tabIndex={0}
        className="group my-4 block w-full transform cursor-pointer rounded-lg border-2 border-gray-300 px-4 py-1 text-left text-black transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md active:opacity-50 dark:border-gray-500"
        onClick={() => {
          rf.open(data.shortCode);
        }}
      >
        <p className="text-base font-semibold text-gray-500 dark:text-gray-300">
          {data.name}
        </p>
        <div className="mt-1 flex items-center gap-1">
          <Avatar
            size={16}
            text={data.owner?.firstName?.charAt(0).toUpperCase() || '?'}
            color={data.owner?.color || '#646464'}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {data.owner?.firstName || 'Unknown'}{' '}
            {data.owner?.lastName?.charAt(0) || 'Owner'}
          </p>
          {data.termId && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              • {getTermName(data.termId)}
            </p>
          )}
        </div>
        <div className="absolute -right-2 -top-2 flex overflow-hidden rounded-lg">
          <button
            title="Copy link"
            className="z-20 hidden bg-gray-200 px-1 py-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-sky-100 hover:text-sky-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-sky-400"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                `${window.location.origin}/#${data.shortCode}`
              );
              setHasCopied(true);
            }}
          >
            {hasCopied ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <LinkIcon className="h-5 w-5" />
            )}
          </button>
          <button
            title="Remove from history"
            className="z-20 hidden bg-gray-200 px-1 py-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-red-100 hover:text-red-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              rf.remove(data.shortCode);
            }}
          >
            <MinusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
