interface TextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  validator?: (value: string) => boolean;
  onBlur?: () => void;
  maxLength?: number;
  required?: boolean;
  paragraph?: boolean;
  onEnter?: () => void;
  className?: string;
}

function TextInput({
  value,
  setValue,
  placeholder,
  validator,
  onBlur,
  maxLength,
  required,
  paragraph,
  onEnter,
  className,
}: TextInputProps) {
  const invalid = value && validator ? !validator(value) : !value && required;
  if (paragraph) {
    return (
      <textarea
        className={`h-24 w-full resize-none rounded-md border-2 border-gray-300 px-2 py-1 text-sm outline-none transition-all duration-150 hover:border-gray-400
                dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 ${className} ${
          invalid
            ? 'border-red-500 hover:border-red-500 focus:border-red-500 dark:border-red-500 dark:hover:border-red-500 dark:focus:border-red-500'
            : 'focus:border-gray-800 dark:focus:border-gray-400'
        }`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        maxLength={maxLength}
      />
    );
  }
  return (
    <input
      className={`w-full rounded-md border-2 border-gray-300 px-2 py-1 text-sm outline-none transition-all duration-150 hover:border-gray-400
                dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 ${className} ${
        invalid
          ? 'border-red-500 hover:border-red-500 focus:border-red-500 dark:border-red-500 dark:hover:border-red-500 dark:focus:border-red-500'
          : 'focus:border-gray-800 dark:focus:border-gray-400'
      }`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      maxLength={maxLength}
      onKeyUp={(e) => {
        if (e.key === 'Enter' && onEnter) onEnter();
      }}
    />
  );
}

export default TextInput;
