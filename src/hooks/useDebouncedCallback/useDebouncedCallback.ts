"use client";
import { useCallback, useEffect, useRef } from "react";

const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 300
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debounced;
};

export default useDebouncedCallback;
