/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 09:57:11
 */
import { forwardRef, useContext } from 'react';
import DarkModeIcon from '../svg/DarkModeIcon';
// import LightModeIcon from '../svg/LightModeIcon';
import { ThemeContext } from '~/hooks/ThemeContext';
import LightModeIcon from '../svg/LightModeIcon2';

const DarkMode = forwardRef(() => {
  const { theme, setTheme } = useContext(ThemeContext);

  const clickHandler = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const mode = theme === 'dark' ? 'Light mode' : 'Dark mode';

  return (
    <button
      className="rounded-md flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm transition-colors duration-200  text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={clickHandler}
    >
      {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      {mode}
    </button>
  );
});

export default DarkMode;
