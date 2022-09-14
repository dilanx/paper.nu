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
      className={`flex flex-wrap justify-center gap-3 transition-all duration-150 rounded-md
        border-2 ${
          required && value.length === 0
            ? 'border-red-500'
            : 'border-transparent'
        }`}
    >
      {options.map((option) => (
        <label
          className="flex items-center gap-1 font-medium text-gray-500 dark:text-gray-300 group"
          key={`msi-${title}-${option}`}
        >
          <input
            type="checkbox"
            className={`appearance-none w-4 h-4 rounded-sm
              border-2 border-gray-400 group-hover:border-gray-600
              dark:border-gray-600 dark:group-hover:border-gray-400
              group-active:border-orange-300
              dark:group-active:border-orange-300
              checked:bg-orange-500 checked:border-orange-500
              dark:checked:border-orange-500
              checked:group-hover:bg-orange-400 checked:group-hover:border-orange-400
              dark:checked:group-hover:border-orange-400
              checked:group-active:bg-orange-300 checked:group-active:border-orange-300
              dark:checked:group-active:border-orange-300`}
            name={option}
            checked={value.includes(option)}
            onChange={(e) => {
              if (e.target.checked && !value.includes(option)) {
                setValue([...value, option]);
              }
              if (!e.target.checked && value.includes(option)) {
                setValue(value.filter((s) => s !== option));
              }
            }}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export default MultiSelectInput;
