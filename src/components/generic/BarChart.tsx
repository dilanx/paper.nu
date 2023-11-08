import { Variants, motion } from 'framer-motion';
import { BarChartValue } from '../../types/GenericMenuTypes';

const BAR_CHAR_COLORS = ['red', 'orange', 'yellow', 'teal', 'blue'];

const labelVariants: Variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
  closed: { opacity: 0, transition: { duration: 0.4 } },
};

const barContainerVariants: Variants = {
  open: {
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
};

const barAxisVariants = {
  open: {
    scaleY: 1,
    transition: {
      duration: 0.4,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const barVariants = (width: number): Variants => ({
  open: {
    width: `${width}%`,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      delayChildren: 0.3,
    },
  },
  closed: { width: 0, transition: { duration: 0.2 } },
});

const barLabelVariants: Variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

interface BarChartProps {
  id: string;
  mode?: 'horizontal' | 'vertical';
  values: BarChartValue[];
  className?: string;
  labelClassName?: string;
}

export default function BarChart({
  id,
  mode = 'vertical',
  values,
  className,
  labelClassName,
}: BarChartProps) {
  let max = 0;
  let total = 0;
  for (const value of values) {
    max = Math.max(max, value.value);
    total += value.value;
  }

  return (
    <motion.div
      initial="closed"
      animate="open"
      className={`flex h-32 w-48 ${className}`}
    >
      <motion.div variants={labelVariants} className="flex flex-col">
        {values.map(({ label }, i) => (
          <div
            key={`chart-${id}-label-${i}`}
            className={`flex flex-1 items-center justify-center pr-1 ${labelClassName}`}
          >
            <p className="text-xs font-bold text-gray-400">{label}</p>
          </div>
        ))}
      </motion.div>
      <motion.div
        variants={barAxisVariants}
        className="h-full w-0.5 rounded-sm bg-gray-500"
      />
      <motion.div
        key={id}
        variants={barContainerVariants}
        className="flex h-full w-full flex-col py-0.5"
      >
        {values.map(({ value }, i) => {
          const color = BAR_CHAR_COLORS[i] || 'gray';
          const maxPercentage = (value / (max || 1)) * 100;
          return (
            <motion.div
              variants={barVariants(maxPercentage)}
              key={`chart-${id}-bar-${i}`}
              className={`relative h-full flex-1 rounded-r-sm bg-${color}-200 dark:bg-${color}-300 text-${color}-300 font-bold hover:bg-${color}-300 dark:hover:bg-${color}-400 hover:z-20 hover:shadow-sm`}
            >
              <motion.div
                variants={barLabelVariants}
                className="absolute left-full top-1/2 flex -translate-y-1/2 gap-0.5 px-1 text-xs"
              >
                <p>{((value / (total || 1)) * 100).toFixed(1)}%</p>
                <p className="font-normal text-gray-300 dark:text-gray-400">
                  {value}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
