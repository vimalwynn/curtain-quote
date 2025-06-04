import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
      };
    };
  }
}

export function useElectronStore<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        if (window.electronAPI) {
          const storedValue = await window.electronAPI.store.get(key);
          if (storedValue !== undefined) {
            setValue(storedValue);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load value'));
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = useCallback(async (newValue: T) => {
    try {
      setValue(newValue);
      if (window.electronAPI) {
        await window.electronAPI.store.set(key, newValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update value'));
      throw err;
    }
  }, [key]);

  const deleteValue = useCallback(async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.store.delete(key);
        setValue(initialValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete value'));
      throw err;
    }
  }, [key, initialValue]);

  return {
    value,
    setValue: updateValue,
    deleteValue,
    isLoading,
    error,
    isElectron: !!window.electronAPI
  };
}