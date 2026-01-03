import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getOrCreateConversation, getUserConversations } from '@/lib/messages';

/**
 * GET /api/messages/conversations
 * Get all conversations for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const conversations = await getUserConversations(session.user.id);
    
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Error al obtener conversaciones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/conversations
 * Create or get a conversation with a trainer
 * Body: { trainerId: number }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { trainerId } = body;
    
    if (!trainerId || typeof trainerId !== 'number') {
      return NextResponse.json(
        { error: 'ID de entrenador inválido' },
        { status: 400 }
      );
    }
    
    // Prevent self-conversation
    if (trainerId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes iniciar una conversación contigo mismo' },
        { status: 400 }
      );
    }
    
    const conversation = await getOrCreateConversation(
      session.user.id,
      trainerId
    );
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'El usuario no es un entrenador' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Error al crear conversación' },
      { status: 500 }
    );
  }
}
