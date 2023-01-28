import { useEffect, useState } from 'react';
import Account from '../../../Account';
import { UserInformation } from '../../../types/AccountTypes';
import { Avatar } from '@dilanx/avatar';

interface ToolbarAccountProps {
  loading: boolean;
  onClick?: (x: number, y: number, signedIn: boolean) => void;
  active?: boolean;
}

function ToolbarAccount({ loading, onClick, active }: ToolbarAccountProps) {
  const [info, setInfo] = useState<UserInformation>();

  useEffect(() => {
    if (Account.isLoggedIn()) {
      Account.getUser().then((user) => {
        if (!user) return;
        setInfo(user);
      });
    }
  }, [loading]);

  if (!info) {
    return (
      <button
        onClick={() => {
          if (onClick) {
            onClick(0, 0, false);
          }
        }}
        className="mx-2 flex items-center rounded-lg border-2 border-black bg-white px-4 py-1 font-medium text-black shadow-sm hover:bg-black hover:text-white active:border-gray-700 active:bg-gray-700 active:text-white
          dark:border-white dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:text-black dark:active:border-gray-300 dark:active:bg-gray-300 dark:active:text-black"
      >
        <p className="whitespace-nowrap">Sign in</p>
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        if (onClick) {
          const { x, y, width, height } =
            e.currentTarget.getBoundingClientRect();
          onClick(x + width, y + height + 10, true);
        }
      }}
      className={`mx-2 flex items-center rounded-lg font-bold text-black shadow-sm dark:text-white ${
        active
          ? `bg-gray-200 dark:bg-gray-500`
          : `bg-gray-50 shadow-sm hover:bg-gray-100 active:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500`
      } `}
    >
      <p className="ml-4 mr-2 whitespace-nowrap">
        {info.firstName} {info.lastName.charAt(0)}
      </p>
      <Avatar
        size={32}
        text={info.firstName.charAt(0).toUpperCase()}
        color={info.color}
      />
    </button>
  );
}

export default ToolbarAccount;
