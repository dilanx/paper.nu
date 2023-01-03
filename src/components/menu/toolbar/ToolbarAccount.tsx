import { useEffect, useState } from 'react';
import Account from '../../../Account';
import { UserInformation } from '../../../types/AccountTypes';
import { Avatar } from '@dilanx/avatar';

interface ToolbarAccountProps {}

function ToolbarAccount(props: ToolbarAccountProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [info, setInfo] = useState<UserInformation>();

  useEffect(() => {
    if (Account.isLoggedIn()) {
      setLoggedIn(true);
      Account.getUser().then((user) => {
        if (!user) return;
        setInfo(user);
      });
    }
  }, []);

  return (
    <button className="mx-2 flex items-center rounded-lg bg-green-500 px-4 py-1 font-medium text-white shadow-sm hover:bg-green-600 active:bg-green-700">
      {!loggedIn && <p className="whitespace-nowrap">Sign In</p>}
      {info && (
        <Avatar
          size={64}
          text={info.name.charAt(0).toUpperCase()}
          color={info.color}
        />
      )}
    </button>
  );
}

export default ToolbarAccount;
