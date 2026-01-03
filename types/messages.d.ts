export interface Conversation {
  id: number;
  user_id: number;
  trainer_id: number;
  last_message_at: Date;
  created_at: Date;
  // Additional fields from joins
  other_user_name?: string;
  other_user_surname?: string;
  other_user_email?: string;
  last_message_content?: string;
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: Date;
  // Additional fields
  sender_name?: string;
  sender_surname?: string;
}

export interface ConversationWithDetails extends Conversation {
  other_user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  last_message: string | null;
  unread_count: number;
}
