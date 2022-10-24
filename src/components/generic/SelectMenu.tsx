import { SelectMenuOption } from '../../types/AlertTypes';
import { Color } from '../../types/BaseTypes';

interface SelectMenuProps {
  options: SelectMenuOption[];
  value?: string;
  setValue: (value: string) => void;
  color: Color;
}

function SelectMenu({ options, value, setValue, color }: SelectMenuProps) {
  return (
    <div className="flex gap-2 flex-wrap m-2">
      {options.map((option, i) => (
        <button
          className={`text-sm font-medium px-4 py-1 rounded-xl
          ${
            option.value === value
              ? `bg-${color}-500 text-white`
              : `bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400
                 hover:bg-${color}-100 hover:text-${color}-700 dark:hover:bg-${color}-700 dark:hover:text-gray-100
                 active:bg-${color}-500 active:text-white dark:active:bg-${color}-500 dark:active:text-white`
          }`}
          onClick={() => setValue(option.value)}
          key={`sm-option-${i}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SelectMenu;
