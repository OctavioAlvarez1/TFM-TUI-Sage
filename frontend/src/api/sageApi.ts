import type { StatusResponse, SseEvent } from '../types/chat';

const API_BASE = '/api';

export async function fetchStatus(): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Status check failed');
  return res.json();
}

export async function* streamAsk(
  question: string,
  nResults = 5,
): AsyncGenerator<SseEvent> {
  const res = await fetch(`${API_BASE}/ask/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, n_results: nResults }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const json = line.slice(6).trim();
        if (json) yield JSON.parse(json) as SseEvent;
      }
    }
  }
}
