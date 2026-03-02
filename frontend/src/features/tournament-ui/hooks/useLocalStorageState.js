import { useEffect, useState } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // no-op for local storage failures
    }
  }, [key, value]);

  const clear = () => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  };

  return [value, setValue, clear];
};

export default useLocalStorageState;
