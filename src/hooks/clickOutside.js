
import { useEffect } from 'react';

export function useClickOutside(handleClickOutside) {
  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
}
