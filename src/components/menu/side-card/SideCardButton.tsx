import {
  SideCardButtonData,
  sideCardButtonIsToggleable,
  ToggleableSideCardButtonData,
} from '../../../types/SideCardTypes';

interface SideCardButtonProps {
  data: SideCardButtonData | ToggleableSideCardButtonData;
  close: () => void;
}

function SideCardButton({ data, close }: SideCardButtonProps) {
  let info: SideCardButtonData;

  if (sideCardButtonIsToggleable(data)) {
    let enabled = false;
    if (data.data instanceof Set) {
      enabled = data.data.has(data.key);
    } else {
      const indexProperty = data.indexProperty;
      if (indexProperty) {
        enabled = data.data.some(
          (value) => value[indexProperty] === data.key[indexProperty]
        );
      } else {
        enabled = data.data.includes(data.key);
      }
    }

    info = enabled ? data.enabled : data.disabled;
  } else {
    info = data;
  }

  return (
    <button
      disabled={info.disabled}
      className={`my-1 w-full bg-gray-100 p-2 font-medium dark:bg-gray-800 ${
        info.danger
          ? `text-red-500 dark:text-red-500 ${
              info.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-red-500 hover:text-gray-100 active:bg-red-600 active:text-gray-100 dark:hover:bg-red-500 dark:hover:text-gray-100 dark:active:bg-red-600 dark:active:text-gray-100'
            }`
          : `text-gray-600 dark:text-gray-300 ${
              info.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500'
            }`
      }
        rounded-lg shadow-sm`}
      onClick={() => info.onClick(close)}
    >
      <span className="block">{info.text}</span>
      {info.disabled && info.disabledText && (
        <span className="block text-xs font-normal">{info.disabledText}</span>
      )}
    </button>
  );
}

export default SideCardButton;
