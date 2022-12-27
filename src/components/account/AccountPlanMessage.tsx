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
    <div className="flex h-4/5 flex-col justify-center px-8 text-center">
      <div className="mx-auto my-2 flex items-center justify-center text-rose-500 dark:text-rose-400">
        {props.icon}
      </div>
      {props.title && (
        <p className="m-2 text-xl font-medium text-rose-500 dark:text-rose-400">
          {props.title}
        </p>
      )}
      {props.description && (
        <p className="m-2 text-sm font-light text-gray-700 dark:text-gray-300">
          {props.description}
        </p>
      )}
      {props.primaryButton && (
        <button
          className="m-2 rounded-lg bg-rose-500 p-2 text-white shadow-lg hover:opacity-75 active:opacity-60"
          onClick={() => props.primaryButton?.action()}
        >
          {props.primaryButton.text}
        </button>
      )}
      {props.secondaryButton && (
        <button
          className="mx-8 my-2 rounded-lg bg-gray-300 p-1 text-gray-500 shadow-sm hover:opacity-75 active:opacity-60 dark:bg-gray-500 dark:text-gray-100"
          onClick={() => props.secondaryButton?.action()}
        >
          {props.secondaryButton.text}
        </button>
      )}
    </div>
  );
}

export default AccountPlanMessage;
