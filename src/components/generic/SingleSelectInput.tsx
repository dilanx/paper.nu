import { XMarkIcon } from '@heroicons/react/24/outline';

interface SingleSelectInputProps {
  title: string;
  options: string[];
  value?: string;
  setValue: (value?: string) => void;
  required?: boolean;
  rangeLabels?: string[];
}

function SingleSelectInput({
  title,
  options,
  value,
  setValue,
  required,
  rangeLabels,
}: SingleSelectInputProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border-2 transition-all duration-150 ${
        required && !value ? 'border-red-500' : 'border-transparent'
      }`}
    >
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <label
            className="group flex cursor-pointer items-center gap-1 font-medium text-gray-500 dark:text-gray-300"
            key={`ssi-${title}-${option}`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer appearance-none rounded-full border-2
              border-gray-400 checked:border-black checked:bg-black
              group-hover:border-gray-500 checked:group-hover:border-gray-700 checked:group-hover:bg-gray-700
              group-active:border-gray-600 checked:group-active:border-gray-600 checked:group-active:bg-gray-600
              dark:border-gray-600 dark:checked:border-white dark:checked:bg-white
              dark:group-hover:border-gray-400 dark:checked:group-hover:border-gray-300 dark:checked:group-hover:bg-gray-300
              dark:group-active:border-gray-300 dark:checked:group-active:border-gray-400 dark:checked:group-active:bg-gray-400"
              name={option}
              checked={value === option}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue(option);
                } else {
                  e.preventDefault();
                }
              }}
            />
            {option}
          </label>
        ))}
      </div>
      {rangeLabels && (
        <div className="flex w-full justify-between px-2 text-xs">
          {rangeLabels.map((label, i) => (
            <p
              className="font-medium text-gray-400 dark:text-gray-500"
              key={`ssi-rl-${title}-${i}`}
            >
              {label}
            </p>
          ))}
        </div>
      )}
      {!required && value && (
        <div className="flex w-full justify-end px-2 py-0.5 text-xs font-medium">
          <button
            className="flex items-center gap-0.5 rounded-md px-1 py-0.5 text-gray-400 hover:bg-gray-200/50 active:bg-gray-200 dark:text-gray-500 dark:hover:bg-gray-600/50 dark:active:bg-gray-600"
            onClick={() => setValue(undefined)}
          >
            <XMarkIcon className="h-3 w-3 stroke-2" />
            <span>CLEAR</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default SingleSelectInput;
