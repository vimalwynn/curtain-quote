import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Room = 'modern' | 'classic';

interface ThemeContextType {
  theme: Theme;
  room: Room;
  toggleTheme: () => void;
  toggleRoom: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [room, setRoom] = useState<Room>(() => {
    const savedRoom = localStorage.getItem('room');
    return (savedRoom === 'modern' || savedRoom === 'classic') ? savedRoom : 'modern';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'modern', 'classic');
    root.classList.add(theme, room);
    localStorage.setItem('theme', theme);
    localStorage.setItem('room', room);
  }, [theme, room]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleRoom = () => {
    setRoom(prevRoom => prevRoom === 'modern' ? 'classic' : 'modern');
  };

  return (
    <ThemeContext.Provider value={{ theme, room, toggleTheme, toggleRoom }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}