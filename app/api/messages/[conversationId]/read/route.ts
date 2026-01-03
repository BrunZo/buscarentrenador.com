import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { markMessagesAsRead } from '@/lib/messages';

/**
 * PATCH /api/messages/[conversationId]/read
 * Mark all messages in a conversation as read
 */
export async function PATCH(
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
    
    await markMessagesAsRead(convId, session.user.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al marcar mensajes como leídos' },
      { status: 500 }
    );
  }
}
