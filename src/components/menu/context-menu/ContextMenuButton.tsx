import { ContextMenuItem } from '../../../types/BaseTypes';

interface ContextMenuButtonProps {
  data: ContextMenuItem;
  sm?: boolean;
  close: () => void;
}

function ContextMenuButton({ data, sm: xs, close }: ContextMenuButtonProps) {
  return (
    <button
      className={`flex w-full flex-col gap-1 px-4 py-2 ${
        data.danger
          ? 'text-red-500 dark:text-red-400'
          : 'text-gray-600 dark:text-gray-300'
      } ${
        data.disabled
          ? 'cursor-not-allowed opacity-50'
          : `hover:bg-gray-100  active:bg-gray-200  dark:hover:bg-gray-600 dark:active:bg-gray-500 ${
              data.danger
                ? ''
                : 'hover:text-gray-800 active:text-gray-800 dark:hover:text-gray-50 dark:active:text-gray-50'
            }`
      } ${xs ? 'text-xs' : 'text-sm'}`}
      disabled={data.disabled}
      onClick={() => {
        data.onClick();
        close();
      }}
    >
      <div className="flex w-full items-center justify-end gap-4">
        <p className="flex-1 whitespace-nowrap text-left">{data.text}</p>
        <data.icon className="h-4 w-4 stroke-2" />
      </div>
      {data.description && (
        <p className="max-w-[160px] text-left text-xs text-gray-400 sm:max-w-[240px]">
          {data.description}
        </p>
      )}
      {data.disabled && data.disabledReason && (
        <p className="max-w-[160px] text-left text-xs font-medium sm:max-w-[240px]">
          {data.disabledReason}
        </p>
      )}
    </button>
  );
}

export default ContextMenuButton;
