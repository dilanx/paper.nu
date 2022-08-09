interface TextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  validator?: (value: string) => boolean;
}

function TextInput({
  value,
  setValue,
  placeholder,
  validator,
}: TextInputProps) {
  const invalid = value ? !validator?.(value) : false;
  return (
    <input
      className={`text-sm dark:bg-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 w-full outline-none px-2 py-1 rounded-md
                hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-150 ${
                  invalid
                    ? 'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus:border-red-500 dark:focus:border-red-500'
                    : 'focus:border-gray-800 dark:focus:border-gray-400'
                }`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default TextInput;
