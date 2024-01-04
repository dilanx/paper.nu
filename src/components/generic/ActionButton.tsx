interface ActionButtonProps {
  padding?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ActionButton({
  padding = 'small',
  onClick,
  children,
}: ActionButtonProps) {
  return (
    <button
      className={`group relative flex items-center rounded-md ${
        padding === 'large' ? 'p-1.5' : padding === 'medium' ? 'p-1' : 'p-0.5'
      } text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
