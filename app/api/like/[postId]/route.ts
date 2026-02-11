import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {verifyToken} from '@/app/lib/jwt';
import {PostModel} from "@/app/models";

export async function POST(
    request: NextRequest,
    {params}: {params: Promise<{ postId: string }> }
) {
    try {
        await initDB();

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({error: 'Token manquant'}, {status: 401});
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({error: 'Token invalide'}, {status: 401});
        }

        const { postId } = await params;
        const numericPostId = parseInt(postId, 10);

        if (isNaN(numericPostId)) {
            return NextResponse.json({error: 'ID de post invalide'}, {status: 400});
        }

        const result = await PostModel.updateLike(numericPostId, payload.userId);
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.error('Erreur lors du like:', error);
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        );
    }
}