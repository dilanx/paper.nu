interface SingleSelectInputProps {
  title: string;
  options: string[];
  value?: string;
  setValue: (value: string) => void;
  required?: boolean;
}

function SingleSelectInput({
  title,
  options,
  value,
  setValue,
  required,
}: SingleSelectInputProps) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-3 rounded-md border-2 transition-all
        duration-150 ${
          required && !value ? 'border-red-500' : 'border-transparent'
        }`}
    >
      {options.map((option) => (
        <label
          className="group flex items-center gap-1 font-medium text-gray-500 dark:text-gray-300"
          key={`ssi-${title}-${option}`}
        >
          <input
            type="checkbox"
            className="h-4 w-4 appearance-none rounded-full border-2
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
  );
}

export default SingleSelectInput;
