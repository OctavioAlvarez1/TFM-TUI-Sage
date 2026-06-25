import { useState, useCallback } from 'react';
import { streamAsk } from '../api/sageApi';
import type { ChatMessage, SourceDocument } from '../types/chat';

export function useSageStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      sources: [],
      isStreaming: false,
      timestamp: new Date(),
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      sources: [],
      isStreaming: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);
    setError(null);

    try {
      for await (const event of streamAsk(question)) {
        if (event.type === 'source') {
          const src: SourceDocument = {
            destination_name: event.destination_name,
            text: event.text,
            relevance: event.relevance,
          };
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, sources: [...m.sources, src] } : m,
            ),
          );
        } else if (event.type === 'token') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + event.content } : m,
            ),
          );
        } else if (event.type === 'done') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m,
            ),
          );
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false, content: m.content || 'Sorry, an error occurred.' }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
