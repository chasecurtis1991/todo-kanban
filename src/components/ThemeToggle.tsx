import React, { useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { Theme } from '../types';
import { clsx } from 'clsx';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const options: { value: Theme; icon: React.ReactNode }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {options.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={clsx(
            'p-2 rounded-md transition-colors',
            theme === value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}