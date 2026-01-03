import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getConversationMessages, sendMessage } from '@/lib/messages';

/**
 * GET /api/messages/[conversationId]
 * Get all messages from a conversation
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { conversationId } = await params;
    const convId = parseInt(conversationId);
    
    if (isNaN(convId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido' },
        { status: 400 }
      );
    }
    
    const messages = await getConversationMessages(convId, session.user.id);
    
    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/[conversationId]
 * Send a message in a conversation
 * Body: { content: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { conversationId } = await params;
    const convId = parseInt(conversationId);
    
    if (isNaN(convId)) {
      return NextResponse.json(
        { error: 'ID de conversación inválido' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { content } = body;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }
    
    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje es demasiado largo (máximo 2000 caracteres)' },
        { status: 400 }
      );
    }
    
    const message = await sendMessage(
      convId,
      session.user.id,
      content.trim()
    );
    
    if (!message) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
