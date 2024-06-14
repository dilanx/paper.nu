import { CheckIcon } from '@heroicons/react/24/outline';
import { Color } from '@/types/BaseTypes';
import Tooltip from './Tooltip';

interface ColorSelectInputProps {
  title: string;
  value?: Color;
  setValue: (value: Color) => void;
  required?: boolean;
}

const ALL_COLORS: Color[] = [
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

export default function ColorSelectInput({
  title,
  value,
  setValue,
  required,
}: ColorSelectInputProps) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-3 rounded-md border-2 transition-all
    duration-150 ${
      required && !value ? 'border-red-500' : 'border-transparent'
    }`}
    >
      {ALL_COLORS.map((color) => (
        <button
          className={`group relative flex h-7 w-7 items-center justify-center rounded-full bg-${color}-500 border-2 ${
            value === color
              ? 'border-black dark:border-white'
              : 'border-white hover:border-gray-300 active:border-black dark:border-gray-700 dark:hover:border-gray-400 dark:active:border-white'
          }`}
          key={`csi-${title}-${color}`}
          onClick={() => setValue(color)}
        >
          {value === color && (
            <CheckIcon className="h-4 w-4 stroke-2 text-black dark:text-white" />
          )}
          <Tooltip
            color={color}
            className="-bottom-10 left-1/2 -translate-x-1/2"
          >
            {color.replace(/^\w/, (c) => c.toUpperCase())}
          </Tooltip>
        </button>
      ))}
    </div>
  );
}
