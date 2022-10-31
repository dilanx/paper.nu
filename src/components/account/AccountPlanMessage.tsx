interface AccountPlanMessageProps {
  icon: JSX.Element;
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    action: () => void;
  };
  secondaryButton?: {
    text: string;
    action: () => void;
  };
}

function AccountPlanMessage(props: AccountPlanMessageProps) {
  return (
    <div className="flex flex-col justify-center text-center h-4/5 px-8">
      <div className="mx-auto my-2 flex items-center justify-center text-rose-500 dark:text-rose-400">
        {props.icon}
      </div>
      {props.title && (
        <p className="text-xl font-medium text-rose-500 dark:text-rose-400 m-2">
          {props.title}
        </p>
      )}
      {props.description && (
        <p className="text-sm font-light text-gray-700 dark:text-gray-300 m-2">
          {props.description}
        </p>
      )}
      {props.primaryButton && (
        <button
          className="m-2 bg-rose-500 text-white rounded-lg p-2 shadow-lg hover:opacity-75 active:opacity-60"
          onClick={() => props.primaryButton?.action()}
        >
          {props.primaryButton.text}
        </button>
      )}
      {props.secondaryButton && (
        <button
          className="mx-8 my-2 p-1 bg-gray-300 text-gray-500 dark:bg-gray-500 dark:text-gray-100 rounded-lg shadow-sm hover:opacity-75 active:opacity-60"
          onClick={() => props.secondaryButton?.action()}
        >
          {props.secondaryButton.text}
        </button>
      )}
    </div>
  );
}

export default AccountPlanMessage;
