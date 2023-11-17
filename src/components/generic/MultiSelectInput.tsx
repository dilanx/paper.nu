import { CheckIcon } from '@heroicons/react/24/outline';

interface MultiSelectInputProps {
  title: string;
  options: string[];
  value: string[];
  setValue: (options: string[]) => void;
  required?: boolean;
}

function MultiSelectInput({
  title,
  options,
  value,
  setValue,
  required,
}: MultiSelectInputProps) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-3 rounded-md border-2 transition-all
        duration-150 ${
          required && value.length === 0
            ? 'border-red-500'
            : 'border-transparent'
        }`}
    >
      {options.map((option) => {
        const checked = value.includes(option);
        return (
          <label
            className="group flex cursor-pointer items-center gap-1 font-medium text-gray-500 dark:text-gray-300"
            key={`msi-${title}-${option}`}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer appearance-none rounded-sm border-2
            border-gray-400 checked:border-black checked:bg-black
            group-hover:border-gray-500 checked:group-hover:border-gray-700 checked:group-hover:bg-gray-700
            group-active:border-gray-600 checked:group-active:border-gray-600 checked:group-active:bg-gray-600
            dark:border-gray-600 dark:checked:border-white dark:checked:bg-white
            dark:group-hover:border-gray-400 dark:checked:group-hover:border-gray-300 dark:checked:group-hover:bg-gray-300
            dark:group-active:border-gray-300 dark:checked:group-active:border-gray-400 dark:checked:group-active:bg-gray-400"
                name={option}
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked && !checked) {
                    setValue([...value, option]);
                  }
                  if (!e.target.checked && checked) {
                    setValue(value.filter((s) => s !== option));
                  }
                }}
              />
              {checked && (
                <CheckIcon className="absolute h-3 w-3 stroke-[3px] text-white dark:text-gray-700" />
              )}
            </div>
            {option}
          </label>
        );
      })}
    </div>
  );
}

export default MultiSelectInput;
