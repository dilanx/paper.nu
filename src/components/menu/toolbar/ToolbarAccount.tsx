import { useEffect, useState } from 'react';
import Account from '../../../Account';
import { UserInformation } from '../../../types/AccountTypes';
import { Avatar } from '@dilanx/avatar';
import { Color } from '../../../types/BaseTypes';

interface ToolbarAccountProps {
  loading: boolean;
  onClick?: (x: number, y: number, signedIn: boolean) => void;
  active?: boolean;
  theme: Color;
}

function ToolbarAccount({
  loading,
  onClick,
  active,
  theme,
}: ToolbarAccountProps) {
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
        className={`mx-2 flex items-center rounded-lg bg-${theme}-500 px-4 py-1 font-medium text-white shadow-sm hover:bg-${theme}-600 active:bg-${theme}-700`}
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
          ? `bg-${theme}-200 dark:bg-${theme}-500`
          : `bg-${theme}-50 shadow-sm hover:bg-${theme}-100 active:bg-${theme}-200 dark:bg-gray-700 dark:hover:bg-${theme}-600 dark:active:bg-${theme}-500`
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
