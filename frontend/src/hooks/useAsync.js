import { useCallback, useEffect, useRef, useState } from "react";

export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const active = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (active.current) setData(result);
      return result;
    } catch (err) {
      if (active.current) setError(err);
      throw err;
    } finally {
      if (active.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    active.current = true;
    run().catch(() => {});
    return () => {
      active.current = false;
    };
  }, [run]);

  return { data, loading, error, refetch: run };
}
