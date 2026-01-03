'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/messages';
import MessageBubble from './message_bubble';

interface ChatWindowProps {
  conversationId: number;
  userId: number;
  otherUserName: string;
  otherUserSurname: string;
}

export default function ChatWindow({
  conversationId,
  userId,
  otherUserName,
  otherUserSurname
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const fetchMessages = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      
      const response = await fetch(`/api/messages/${conversationId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages);
        if (!isPolling) {
          setTimeout(() => 100);
        }
        setError('');
      } else {
        setError(data.error || 'Error al cargar mensajes');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (!isPolling) {
        setError('Error al cargar mensajes');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/messages/${conversationId}/read`, {
        method: 'PATCH',
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    setError('');
    
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewMessage('');
        await fetchMessages();
      } else {
        setError(data.error || 'Error al enviar mensaje');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    markAsRead();
    
    // Set up polling every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(true);
      markAsRead();
    }, 10000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [conversationId]);


  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-gray-500'>Cargando mensajes...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[600px]'>
      {/* Header */}
      <div className='border-b border-gray-200 pb-4 mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold'>
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className='font-semibold text-gray-900'>
              {otherUserName} {otherUserSurname}
            </h3>
            <p className='text-xs text-gray-500'>Entrenador</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto mb-4 px-2'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
            No hay mensajes aún. ¡Envía el primero!
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Escribe un mensaje...'
          className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none'
          rows={2}
          maxLength={2000}
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          type='submit'
          disabled={!newMessage.trim() || sending}
          className='self-end px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg'
        >
          {sending ? (
            <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
            </svg>
          ) : (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
