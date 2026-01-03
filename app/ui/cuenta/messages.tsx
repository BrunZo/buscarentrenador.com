'use client';

import { useState, useEffect } from 'react';
import { ConversationWithDetails } from '@/types/messages';
import ConversationList from './conversation_list';
import ChatWindow from './chat_window';

interface MessagesProps {
  userId: number;
  initialConversationId?: number;
}

export default function Messages({ userId, initialConversationId }: MessagesProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    initialConversationId || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      const data = await response.json();
      
      if (response.ok) {
        setConversations(data.conversations);
        
        // If there's an initial conversation ID and it exists, select it
        if (initialConversationId) {
          const exists = data.conversations.some(
            (conv: ConversationWithDetails) => conv.id === initialConversationId
          );
          if (exists) {
            setSelectedConversationId(initialConversationId);
          }
        }
        
        // If no conversation is selected and we have conversations, select the first one
        if (!selectedConversationId && data.conversations.length > 0) {
          setSelectedConversationId(data.conversations[0].id);
        }
        
        setError('');
      } else {
        setError(data.error || 'Error al cargar conversaciones');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Error al cargar conversaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Refresh conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-gray-500'>Cargando mensajes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-600'>
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>Mensajes</h2>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Conversations List */}
        <div className='lg:col-span-1'>
          <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Conversaciones
              {conversations.length > 0 && (
                <span className='ml-2 text-sm font-normal text-gray-500'>
                  ({conversations.length})
                </span>
              )}
            </h3>
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className='lg:col-span-2'>
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation.id}
              userId={userId}
              otherUserName={selectedConversation.other_user.name}
              otherUserSurname={selectedConversation.other_user.surname}
            />
          ) : (
            <div className='flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-lg border border-gray-200'>
              <svg className='w-20 h-20 mb-4 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
              <p className='text-gray-500 text-lg mb-2'>Selecciona una conversación</p>
              <p className='text-gray-400 text-sm'>Elige una conversación para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
