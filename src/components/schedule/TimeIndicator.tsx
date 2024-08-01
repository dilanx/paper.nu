interface TimeIndicatorProps {
  left: string | number;
  top: string | number;
  dim?: boolean;
  children?: React.ReactNode;
}

export default function TimeIndicator({
  left,
  top,
  dim,
  children,
}: TimeIndicatorProps) {
  return (
    <div
      className="absolute z-[31] -translate-y-1/2 whitespace-nowrap rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-medium text-white"
      style={{ left, top, opacity: dim ? 0.75 : 1 }}
    >
      {children}
    </div>
  );
}
