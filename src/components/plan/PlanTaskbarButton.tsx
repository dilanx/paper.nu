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
      className="block rounded-lg bg-gray-300 px-5 py-1 text-gray-600 opacity-50 shadow-sm hover:opacity-75 active:opacity-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
