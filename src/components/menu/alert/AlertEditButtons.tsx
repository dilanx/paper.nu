import {
  AlertDataEditButton,
  AlertDataEditButtonData,
  editButtonIsToggleable,
} from '@/types/AlertTypes';
import Tooltip from '@/components/generic/Tooltip';

export const getAlertEditButtons = (
  editButtons: AlertDataEditButton[] | undefined,
  close: () => void
) =>
  editButtons?.map((editButton, i) => {
    let dataSet: AlertDataEditButtonData;

    if (editButtonIsToggleable(editButton)) {
      const data = editButton.data;
      const key = editButton.key;
      const indexProperty = editButton.indexProperty;

      let enabled = false;

      if (data instanceof Set) {
        enabled = data.has(key);
      } else {
        if (indexProperty) {
          enabled = data.some(
            (value) => value[indexProperty] === key[indexProperty]
          );
        } else {
          enabled = data.includes(key);
        }
      }

      dataSet = enabled ? editButton.enabled : editButton.disabled;
    } else {
      dataSet = editButton.buttonData;
    }

    const color = dataSet.color;

    return (
      <button
        className={`text-gray-500 hover:text-${color}-400 group relative`}
        key={`edit-button-${i}`}
        onClick={() => {
          dataSet.action();
          if (dataSet.close) close();
        }}
      >
        {dataSet.icon}
        <Tooltip color={color} className="-bottom-10 right-0 w-40">
          {dataSet.title}
        </Tooltip>
      </button>
    );
  }) ?? [];
