import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {auth} from "@/app/lib/auth";
import {PostModel} from "@/app/models";

export async function POST(
    request: NextRequest,
    {params}: {params: {postId: string}}
) {
    try {
        await initDB();

        if (!auth.isAuthenticated()) {
            return NextResponse.json({error: 'Utilisateur non authentifié'}, {status: 401});
        }

        const postId = parseInt(params.postId);
        if (isNaN(postId)) {
            return NextResponse.json({error: 'postId invalide'}, {status: 400});
        }

        const result = await PostModel.updateLike(postId, auth.getUser()!.id);
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.error('Erreur lors du like:', error);
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        );
    }
}