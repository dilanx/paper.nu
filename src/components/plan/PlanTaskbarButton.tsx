interface PlanTaskbarButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function PlanTaskbarButton({
  onClick,
  children,
}: PlanTaskbarButtonProps) {
  return (
    <button
      className="block rounded-lg bg-gray-200 px-5 py-1 text-gray-400 shadow-sm
        hover:bg-gray-300 hover:text-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
