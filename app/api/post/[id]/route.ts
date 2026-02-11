import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/app/lib/db';
import { PostModel } from '@/app/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDB();

        const { id } = await params;
        const numericId = parseInt(id, 10)

        console.log("Recherche en BDD pour ID:", numericId);

        const post = await PostModel.findById(numericId);

        if (!post) {
            return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
        }

        return NextResponse.json({
            id: post.id,
            name: post.userId,
            email: post.content,
            picture: post.image,
            creation_date: post.creationDate,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}