import { useState, useCallback, useEffect, useRef } from 'react';
import { streamAsk } from '../api/sageApi';
import { useApp } from '../context/AppContext';
import type { ChatMessage, ConversationTurn, FeedbackType, SourceDocument } from '../types/chat';

const MAX_HISTORY = 6;

export function useSageStream() {
  const { lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef(messages);
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const sendMessage = useCallback(async (question: string) => {
    const history: ConversationTurn[] = messagesRef.current
      .filter((m) => !m.isStreaming && m.content)
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

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
      for await (const event of streamAsk(question, history, langRef.current)) {
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
            ? { ...m, isStreaming: false, content: m.content || 'Lo siento, ocurrió un error.' }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rateFeedback = useCallback((messageId: string, feedback: FeedbackType) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, feedback: m.feedback === feedback ? null : feedback }
          : m,
      ),
    );
    const msg = messagesRef.current.find((m) => m.id === messageId);
    if (msg) {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, answer: msg.content, feedback }),
      }).catch(() => {});
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, error, sendMessage, rateFeedback, clearMessages };
}
