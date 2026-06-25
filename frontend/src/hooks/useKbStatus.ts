import { useState, useEffect } from 'react';
import { fetchStatus } from '../api/sageApi';
import type { StatusResponse } from '../types/chat';

export function useKbStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const s = await fetchStatus();
        if (!cancelled) setStatus(s);
      } catch {
        if (!cancelled)
          setStatus({
            kb_built: false,
            api_key_set: false,
            collection_name: '',
            document_count: 0,
            status: 'error',
          });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return { status, loading };
}
