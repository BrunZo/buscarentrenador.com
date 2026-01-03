import pool from './db';
import { Conversation, Message, ConversationWithDetails } from '@/types/messages';

/**
 * Get or create a conversation between a user and a trainer
 */
export async function getOrCreateConversation(
  userId: number,
  trainerId: number
): Promise<Conversation | null> {
  const client = await pool.connect();
  
  try {
    // First check if trainer exists
    const trainerCheck = await client.query(
      'SELECT id FROM trainers WHERE user_id = $1',
      [trainerId]
    );
    
    if (trainerCheck.rows.length === 0) {
      return null; // Target user is not a trainer
    }
    
    // Check if conversation already exists
    let result = await client.query(
      'SELECT * FROM conversations WHERE user_id = $1 AND trainer_id = $2',
      [userId, trainerId]
    );
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    
    // Create new conversation
    result = await client.query(
      'INSERT INTO conversations (user_id, trainer_id) VALUES ($1, $2) RETURNING *',
      [userId, trainerId]
    );
    
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Get all conversations for a user with details
 */
export async function getUserConversations(
  userId: number
): Promise<ConversationWithDetails[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        c.*,
        CASE 
          WHEN c.user_id = $1 THEN u2.id
          ELSE u1.id
        END as other_user_id,
        CASE 
          WHEN c.user_id = $1 THEN u2.name
          ELSE u1.name
        END as other_user_name,
        CASE 
          WHEN c.user_id = $1 THEN u2.surname
          ELSE u1.surname
        END as other_user_surname,
        CASE 
          WHEN c.user_id = $1 THEN u2.email
          ELSE u1.email
        END as other_user_email,
        m.content as last_message_content,
        (
          SELECT COUNT(*)
          FROM messages m2
          WHERE m2.conversation_id = c.id
            AND m2.sender_id != $1
            AND m2.is_read = FALSE
        ) as unread_count
      FROM conversations c
      INNER JOIN users u1 ON c.user_id = u1.id
      INNER JOIN users u2 ON c.trainer_id = u2.id
      LEFT JOIN LATERAL (
        SELECT content
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON TRUE
      WHERE c.user_id = $1 OR c.trainer_id = $1
      ORDER BY c.last_message_at DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      trainer_id: row.trainer_id,
      last_message_at: row.last_message_at,
      created_at: row.created_at,
      other_user: {
        id: row.other_user_id,
        name: row.other_user_name,
        surname: row.other_user_surname,
        email: row.other_user_email,
      },
      last_message: row.last_message_content || null,
      unread_count: parseInt(row.unread_count) || 0,
    }));
  } finally {
    client.release();
  }
}

/**
 * Get messages from a conversation
 */
export async function getConversationMessages(
  conversationId: number,
  userId: number
): Promise<Message[]> {
  const client = await pool.connect();
  
  try {
    // First verify user is part of the conversation
    const convResult = await client.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user_id = $2 OR trainer_id = $2)',
      [conversationId, userId]
    );
    
    if (convResult.rows.length === 0) {
      throw new Error('Unauthorized');
    }
    
    // Get messages
    const result = await client.query(
      `SELECT 
        m.*,
        u.name as sender_name,
        u.surname as sender_surname
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC`,
      [conversationId]
    );
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: number,
  senderId: number,
  content: string
): Promise<Message | null> {
  const client = await pool.connect();
  
  try {
    // Verify user is part of the conversation
    const convResult = await client.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user_id = $2 OR trainer_id = $2)',
      [conversationId, senderId]
    );
    
    if (convResult.rows.length === 0) {
      return null;
    }
    
    // Insert message
    const messageResult = await client.query(
      `INSERT INTO messages (conversation_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [conversationId, senderId, content]
    );
    
    // Update conversation's last_message_at
    await client.query(
      'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );
    
    return messageResult.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Mark messages as read in a conversation
 */
export async function markMessagesAsRead(
  conversationId: number,
  userId: number
): Promise<void> {
  const client = await pool.connect();
  
  try {
    // Verify user is part of the conversation
    const convResult = await client.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user_id = $2 OR trainer_id = $2)',
      [conversationId, userId]
    );
    
    if (convResult.rows.length === 0) {
      throw new Error('Unauthorized');
    }
    
    // Mark all messages from other user as read
    await client.query(
      `UPDATE messages
       SET is_read = TRUE
       WHERE conversation_id = $1
         AND sender_id != $2
         AND is_read = FALSE`,
      [conversationId, userId]
    );
  } finally {
    client.release();
  }
}

/**
 * Get conversation by ID with authorization check
 */
export async function getConversationById(
  conversationId: number,
  userId: number
): Promise<Conversation | null> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user_id = $2 OR trainer_id = $2)',
      [conversationId, userId]
    );
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/**
 * Get total unread message count for a user
 */
export async function getUnreadMessageCount(userId: number): Promise<number> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT COUNT(DISTINCT m.id) as count
       FROM messages m
       INNER JOIN conversations c ON m.conversation_id = c.id
       WHERE (c.user_id = $1 OR c.trainer_id = $1)
         AND m.sender_id != $1
         AND m.is_read = FALSE`,
      [userId]
    );
    
    return parseInt(result.rows[0].count) || 0;
  } finally {
    client.release();
  }
}
