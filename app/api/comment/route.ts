import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/app/lib/db';
import { CommentModel } from '@/app/models';

export async function POST(request: NextRequest) {
    try {
        await initDB();
        const body = await request.json();
        const { userId, postId, content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 });
        }

        const newComment = await CommentModel.create({ userId, postId, content });
        
        return NextResponse.json(newComment, { status: 200 });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}