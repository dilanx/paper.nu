import { Variants, motion } from 'framer-motion';
import { BarChartMode, BarChartValue } from '@/types/GenericMenuTypes';

const VERTICAL_BAR_CHART_COLORS = ['red', 'orange', 'yellow', 'teal', 'blue'];

const HORIZONTAL_BAR_CHART_COLORS = [
  'green', // A
  'emerald', // A-
  'sky', // B+
  'blue', // B
  'indigo', // B-
  'fuchsia', // C+
  'purple', // C
  'violet', // C-
  'yellow', // D+
  'amber', // D
  'orange', // D-
  'red', // F
  'pink', // P
  'rose', // NP
  'pink', // S
  'rose', // U
];

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

const barVariants = (key: 'width' | 'height', value: number): Variants => ({
  open: {
    [key]: `${value}%`,
    marginTop: key === 'height' ? `calc(${100 - value}%)` : 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      delayChildren: 0.3,
    },
  },
  closed: { [key]: 0, transition: { duration: 0.2 } },
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
  mode?: BarChartMode;
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

  const isHorizontal = mode === 'horizontal';

  return (
    <motion.div
      initial="closed"
      animate="open"
      className={`flex ${
        isHorizontal
          ? 'h-48 min-h-[12rem] w-full flex-col-reverse'
          : 'h-32 w-48 flex-row'
      } ${className}`}
    >
      <motion.div
        variants={labelVariants}
        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      >
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
        className={`rounded-sm bg-gray-500 ${
          isHorizontal ? 'h-0.5 w-full' : 'h-full w-0.5'
        }`}
      />
      <motion.div
        key={id}
        variants={barContainerVariants}
        className={`relative flex h-full w-full ${
          isHorizontal ? 'flex-row px-0.5' : 'flex-col py-0.5'
        }`}
      >
        {values.map(({ value }, i) => {
          const color =
            (isHorizontal
              ? HORIZONTAL_BAR_CHART_COLORS[i]
              : VERTICAL_BAR_CHART_COLORS[i]) || 'gray';
          const maxPercentage = (value / (max || 1)) * 100;
          return (
            <div
              className="relative h-full w-full flex-1"
              key={`chart-${id}-bar-${i}`}
            >
              <motion.div
                variants={barVariants(
                  isHorizontal ? 'height' : 'width',
                  maxPercentage
                )}
                className={`absolute ${
                  isHorizontal
                    ? ' bottom-0 left-0 rounded-t-sm'
                    : 'left-0 top-0 rounded-r-sm'
                } h-full w-full bg-${color}-300 dark:bg-${color}-400 text-${color}-300 font-bold hover:bg-${color}-400 dark:hover:bg-${color}-300 hover:z-20 hover:shadow-sm`}
              >
                <motion.div
                  variants={barLabelVariants}
                  className={`absolute flex gap-0.5 text-xs ${
                    isHorizontal
                      ? 'bottom-full left-1/2 -translate-x-1/2 py-1'
                      : 'left-full top-1/2 -translate-y-1/2 px-1'
                  }`}
                >
                  <p>{Math.round((value / (total || 1)) * 100)}%</p>
                  <p className="font-normal text-gray-300 dark:text-gray-400">
                    {value}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
