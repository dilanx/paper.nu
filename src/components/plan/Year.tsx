import { useApp, useModification } from '@/app/Context';
import UtilityButton from '@/components/menu/UtilityButton';
import { Course } from '@/types/PlanTypes';
import { convertQuarter } from '@/utility/Utility';
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  SunIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Quarter from './Quarter';

interface YearProps {
  data: Course[][];
  year: number;
  title: string;
}

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
};

export default function Year(props: YearProps) {
  const { activeContextMenu, contextMenu } = useApp();
  const { planModification } = useModification();
  const [hidden, setHidden] = useState(false);
  const content = props.data;

  let quarters: JSX.Element[] = [];
  if (content) {
    quarters = content.map((quarter, index) => {
      const { title, color } = convertQuarter(index);
      return (
        <Quarter
          data={quarter}
          location={{ year: props.year, quarter: index }}
          title={title}
          color={color}
          yearHasSummer={content.length === 4}
          key={props.year + '-' + index}
        />
      );
    });
  }

  const menuItems = [
    {
      text: quarters.length < 4 ? 'Add summer' : 'Remove summer',
      icon: SunIcon,
      onClick: () => {
        if (quarters.length < 4) {
          planModification.addSummerQuarter(props.year);
        } else {
          planModification.removeSummerQuarter(props.year);
        }
      },
    },
    {
      text: 'Clear courses',
      icon: TrashIcon,
      onClick: () => {
        planModification.clearData(props.year);
      },
    },
  ];

  if (props.year >= 4) {
    menuItems.push({
      text: 'Delete year',
      icon: MinusIcon,
      onClick: () => {
        planModification.removeYear(props.year);
      },
    });
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <div
        className="relative m-5 rounded-xl border-4 border-gray-200 bg-white p-4 shadow-sm transition-all duration-150
                  compact:my-0 compact:border-0 compact:py-2 compact:shadow-none dark:border-gray-700 dark:bg-gray-800"
      >
        <p
          className={`text-center text-2xl font-bold text-gray-300 compact:text-sm compact:text-black dark:text-gray-500 ${
            hidden ? '' : 'pb-2'
          }`}
        >
          {props.title}
        </p>
        {!hidden && (
          <div
            className={`grid grid-cols-1 gap-12 ${
              quarters.length === 4
                ? 'lg:grid-cols-4 lg:gap-4'
                : 'lg:grid-cols-3'
            }`}
          >
            {quarters}
          </div>
        )}
        <div className="absolute right-2 top-1 flex items-center gap-1">
          <UtilityButton
            Icon={hidden ? ChevronDownIcon : ChevronUpIcon}
            onClick={() => {
              setHidden(!hidden);
            }}
          >
            {hidden ? 'SHOW' : 'HIDE'}
          </UtilityButton>
          <UtilityButton
            Icon={Bars3Icon}
            active={activeContextMenu === `year-actions-${props.year}`}
            onClick={(x, y) => {
              contextMenu({
                x: x,
                y: y,
                name: `year-actions-${props.year}`,
                items: menuItems,
              });
            }}
          >
            MENU
          </UtilityButton>
        </div>
      </div>
    </motion.div>
  );
}
