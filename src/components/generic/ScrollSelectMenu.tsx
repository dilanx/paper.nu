import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { ScrollSelectMenuOption } from '../../types/GenericMenuTypes';

interface ScrollSelectMenuProps {
  options: ScrollSelectMenuOption[];
  selectedValue?: string | null;
  setSelectedValue: (value: string | null) => void;
  className?: string;
  leftPiece?: boolean;
  middlePiece?: boolean;
  rightPiece?: boolean;
}

export default function ScrollSelectMenu({
  options,
  selectedValue,
  setSelectedValue,
  className,
  leftPiece,
  middlePiece,
  rightPiece,
}: ScrollSelectMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      if (selectedRef.current) {
        const selected = selectedRef.current;
        container.scrollTo({
          behavior: 'smooth',
          top:
            selected.offsetTop -
            container.offsetHeight / 2 +
            selected.offsetHeight / 2,
        });
      }

      if (!selectedValue) {
        container.scrollTo({
          behavior: 'smooth',
          top: 0,
        });
      }
    }
  });

  useEffect(() => {
    if (options.find((option) => option.value === selectedValue)?.disabled) {
      setSelectedValue(null);
    }
  }, [options, selectedValue, setSelectedValue]);

  return (
    <div
      ref={containerRef}
      className={`no-scrollbar relative flex h-32 flex-col gap-2 overflow-x-hidden overflow-y-scroll border border-gray-300 bg-gray-100 px-4 py-4 dark:border-gray-600 dark:bg-gray-800 ${className} ${
        leftPiece
          ? 'rounded-lg rounded-r-none border-r-0'
          : middlePiece
          ? 'rounded-none border-l-0 border-r-0'
          : rightPiece
          ? 'rounded-lg rounded-l-none border-l-0'
          : 'rounded-lg'
      }`}
    >
      {options.map((option, i) => {
        const isSelected = option.value === selectedValue;

        const moveButtons: JSX.Element[] = [];

        if (isSelected) {
          if (i > 0) {
            let next = i - 1;
            while (options[next]?.disabled) {
              next--;
            }

            if (next >= 0) {
              moveButtons.push(
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  key={`option-${i}-up`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValue(options[next].value);
                  }}
                >
                  <ChevronUpIcon className="h-4 w-4 stroke-2" />
                </button>
              );
            }
          }

          if (i < options.length - 1) {
            let next = i + 1;
            while (options[next]?.disabled) {
              next++;
            }

            if (next < options.length) {
              moveButtons.push(
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  key={`option-${i}-down`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValue(options[next].value);
                  }}
                >
                  <ChevronDownIcon className="h-4 w-4 stroke-2" />
                </button>
              );
            }
          }
        }

        return (
          <div
            ref={isSelected ? selectedRef : null}
            onClick={() => {
              if (!option.disabled) {
                setSelectedValue(option.value);
              }
            }}
            tabIndex={0}
            className={`relative rounded-md p-1 text-center text-xl font-bold transition-all duration-200 ${
              option.disabled
                ? 'cursor-not-allowed bg-gray-100 text-gray-300 line-through dark:bg-gray-800 dark:text-gray-600'
                : `cursor-pointer ${
                    isSelected
                      ? `text-gray-900 shadow-md dark:bg-gray-600 ${
                          option.color
                            ? `bg-${option.color}-200 dark:text-${option.color}-400`
                            : 'bg-white dark:text-gray-200'
                        }`
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200/50 hover:text-gray-500 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-gray-400 dark:active:bg-gray-700'
                  }`
            }`}
            key={`option-${i}`}
          >
            <span>{option.label || option.value}</span>
            {isSelected && moveButtons}
          </div>
        );
      })}
    </div>
  );
}
