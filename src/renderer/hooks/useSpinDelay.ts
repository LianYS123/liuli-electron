import { useState, useEffect, useRef } from 'react';

interface SpinDelayOptions {
  delay?: number;
  minDuration?: number;
}

type State = 'IDLE' | 'DELAY' | 'DISPLAY' | 'EXPIRE';

export const defaultOptions = {
  delay: 500,
  minDuration: 200,
};

export function useSpinDelay(
  loading: boolean,
  options?: SpinDelayOptions,
): boolean {
  const opts = { ...defaultOptions, ...options };

  const [state, setState] = useState<State>('IDLE');
  const timeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (loading && state === 'IDLE') {
      clearTimeout(timeout.current);

      timeout.current = setTimeout(
        () => {
          if (!loading) {
            setState('IDLE');
            return;
          }

          timeout.current = setTimeout(
            () => {
              setState('EXPIRE');
            },
            opts?.minDuration as number,
          );

          setState('DISPLAY');
        },
        opts?.delay,
      );

      setState('DELAY');
    }

    if (!loading && state !== 'DISPLAY') {
      clearTimeout(timeout.current);
      setState('IDLE');
    }
  }, [loading, state, opts.delay, opts.minDuration]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return state === 'DISPLAY' || state === 'EXPIRE';
}

export default useSpinDelay;
