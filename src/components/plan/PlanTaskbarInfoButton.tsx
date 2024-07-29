interface PlanTaskbarInfoButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function PlanTaskbarInfoButton({
  onClick,
  children,
}: PlanTaskbarInfoButtonProps) {
  return (
    <button
      className="w-40 rounded-lg border-2 border-gray-200 p-1 text-center text-sm font-light text-gray-400 shadow-sm hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-900 dark:active:bg-black"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
