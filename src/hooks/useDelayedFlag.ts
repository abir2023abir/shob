import { useEffect, useState } from "react";

/** Turns true for `ms` whenever `key` changes — drives skeleton states. */
export function useDelayedFlag(key: string, ms = 280): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(true);
    const t = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(t);
  }, [key, ms]);
  return on;
}
