import { ContextMenuItem } from '../../../types/BaseTypes';

interface ContextMenuButtonProps {
  data: ContextMenuItem;
  close: () => void;
}

function ContextMenuButton({ data, close }: ContextMenuButtonProps) {
  return (
    <button
      className="flex w-full items-center justify-end gap-4 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:text-gray-800
        dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-50 dark:active:bg-gray-500 dark:active:text-gray-50"
      onClick={() => {
        data.onClick();
        close();
      }}
    >
      <p className="flex-1 text-left">{data.text}</p>
      <data.icon className="h-4 w-4 stroke-2" />
    </button>
  );
}

export default ContextMenuButton;
