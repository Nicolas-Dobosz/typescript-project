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

        const postDetail = await PostModel.findPostDetailById(numericId);

        if (!postDetail) {
            return NextResponse.json({ error: 'Post non trouvé' }, { status: 404 });
        }

        return NextResponse.json({
            id: postDetail.id,
            content: postDetail.content,
            image: postDetail.image,
            creationDate: postDetail.creationDate,
            // Infos de l'auteur du post
            author: {
                name: postDetail.authorName,
                picture: postDetail.authorPicture
            },
            // Liste des commentaires avec le nom des commentateurs
            comments: postDetail.comments
        });

    } catch (error) {
        console.error("Erreur API PostDetail:", error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}