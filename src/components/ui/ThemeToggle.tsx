import { SunMedium, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      type="button"
      className="rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none"
      onClick={toggleTheme}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <SunMedium className="h-5 w-5 transition-transform hover:rotate-12" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 transition-transform hover:-rotate-12" aria-hidden="true" />
      )}
    </button>
  );
}