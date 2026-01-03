'use client';

import { Message } from '@/types/messages';
import { useState, useEffect } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [formattedTime, setFormattedTime] = useState('');
  console.log(message)
  const formatTime = (date: Date) => {
    const now = new Date();
    console.log("now", now)
    const messageDate = new Date(date);
    console.log("message_time", messageDate)
    const diffInMs = now.getTime() - messageDate.getTime();
    console.log(diffInMs)
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    console.log(diffInMinutes)
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else {
      return messageDate.toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  useEffect(() => {
    // Update time immediately
    setFormattedTime(formatTime(message.created_at));

    // Update every 30 seconds
    const interval = setInterval(() => {
      setFormattedTime(formatTime(message.created_at));
    }, 60000);

    return () => clearInterval(interval);
  }, [message.created_at]);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && message.sender_name && (
          <span className='text-xs text-gray-500 mb-1 px-3'>
            {message.sender_name} {message.sender_surname}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 shadow-sm ${
            isOwn
              ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className='text-sm wrap-break-words whitespace-pre-wrap'>{message.content}</p>
        </div>
        <span className='text-xs text-gray-400 mt-1 px-3'>
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
