import { SunMedium, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, room, toggleTheme, toggleRoom } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
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

      <button
        type="button"
        className="rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none"
        onClick={toggleRoom}
      >
        <span className="sr-only">Toggle room style</span>
        <Palette className={`h-5 w-5 transition-transform ${room === 'modern' ? 'rotate-0' : 'rotate-180'}`} aria-hidden="true" />
      </button>
    </div>
  );
}