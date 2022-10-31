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
      className={`flex flex-wrap justify-center gap-3 transition-all duration-150 rounded-md
        border-2 ${
          required && !value ? 'border-red-500' : 'border-transparent'
        }`}
    >
      {options.map((option) => (
        <label
          className="flex items-center gap-1 font-medium text-gray-500 dark:text-gray-300 group"
          key={`msi-${title}-${option}`}
        >
          <input
            type="checkbox"
            className={`appearance-none w-4 h-4 rounded-full
              border-2 border-gray-400 group-hover:border-gray-600
              dark:border-gray-600 dark:group-hover:border-gray-400
              group-active:border-green-300
              dark:group-active:border-green-300
              checked:bg-green-500 checked:border-green-500
              dark:checked:border-green-500
              checked:group-hover:bg-green-400 checked:group-hover:border-green-400
              dark:checked:group-hover:border-green-400
              checked:group-active:bg-green-300 checked:group-active:border-green-300
              dark:checked:group-active:border-green-300`}
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
