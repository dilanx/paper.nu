interface ChangeLogPreviewButtonProps {
  children?: React.ReactNode;
}

export default function ChangeLogPreviewButton({
  children,
}: ChangeLogPreviewButtonProps) {
  return (
    <button className="rounded-md border border-gray-300 bg-white px-4 py-0.5 text-sm text-gray-600 shadow-sm hover:bg-gray-50 active:bg-gray-100 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
      {children}
    </button>
  );
}
