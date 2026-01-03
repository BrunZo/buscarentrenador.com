'use client';

import { ConversationWithDetails } from '@/types/messages';

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  selectedConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation
}: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return messageDate.toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
        <svg className='w-16 h-16 mb-4 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
        </svg>
        <p className='text-sm'>No tienes conversaciones aún</p>
        <p className='text-xs mt-1'>Contacta a un entrenador para empezar</p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
            selectedConversationId === conversation.id
              ? 'bg-indigo-50 border-2 border-indigo-200'
              : 'bg-white border border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
          }`}
        >
          <div className='flex items-start gap-3'>
            {/* Avatar */}
            <div className='shrink-0'>
              <div className='w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg'>
                {conversation.other_user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-1'>
                <h4 className='font-semibold text-gray-900 truncate'>
                  {conversation.other_user.name} {conversation.other_user.surname}
                </h4>
                <span className='text-xs text-gray-500 shrink-0 ml-2'>
                  {formatTime(conversation.last_message_at)}
                </span>
              </div>
              
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600 truncate'>
                  {conversation.last_message || 'No hay mensajes'}
                </p>
                {conversation.unread_count > 0 && (
                  <span className='shrink-0 ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
