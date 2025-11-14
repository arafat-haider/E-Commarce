import { useState, useEffect } from 'react';

export function useIsomorphicLayoutEffect(effect: () => void, deps?: React.DependencyList) {
  useEffect(effect, deps);
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}