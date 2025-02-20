/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 09:57:11
 */
import { forwardRef } from 'react';
import { useAuthContext } from '~/hooks/AuthContext';

import LogoutIcon from '../svg/LogoutIcon';

const Logout = forwardRef(() => {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <button
      className="rounded-md flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm transition-colors duration-200  text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleLogout}
    >
      <LogoutIcon />
      {/* {user?.username || 'USER'} */}
      Log out
      {/* <small>Log out</small> */}
    </button>
  );
});

export default Logout;
