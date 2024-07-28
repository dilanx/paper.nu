interface ToolbarStatusButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ToolbarStatusButton({
  onClick,
  children,
}: ToolbarStatusButtonProps) {
  return (
    <button
      className={`group relative flex items-center justify-center gap-1 rounded-sm p-0.5 text-xs text-gray-400 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
