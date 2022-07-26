import {
    AlertDataEditButton,
    AlertDataEditButtonData,
    editButtonIsToggleable,
} from '../../../types/AlertTypes';

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
                    data.includes(key);
                }
            }

            dataSet = enabled ? editButton.enabled : editButton.disabled;
        } else {
            dataSet = editButton.buttonData;
        }

        let color = dataSet.color;

        return (
            <button
                className={`text-gray-500 hover:text-${color}-400 transition-all duration-150 relative group`}
                key={`edit-button-${i}`}
                onClick={() => {
                    dataSet.action();
                    if (dataSet.close) close();
                }}
            >
                {dataSet.icon}
                <div
                    className={`hidden group-hover:block absolute -bottom-10 right-0 p-1 w-40 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
                >
                    {dataSet.title}
                </div>
            </button>
        );
    }) ?? [];
