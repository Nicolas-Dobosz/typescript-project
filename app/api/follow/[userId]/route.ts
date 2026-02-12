import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {FollowModel} from '@/app/models';
import {verifyToken} from "@/app/lib/jwt";

export async function POST(
    request: NextRequest,
    {params}: {params: Promise<{ userId: string }> }
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

        const { userId } = await params;
        const numericUserId = parseInt(userId, 10);
        
        if (isNaN(numericUserId)) {
            return NextResponse.json({error: 'ID de user invalide'}, {status: 400});
        }

        // block auto-follow
        if (payload.userId === numericUserId) {
            return NextResponse.json({error: 'Vous ne pouvez pas vous suivre vous-même'}, {status: 400});
        }

        console.log(`User ${payload.userId} is trying to follow user ${numericUserId}`);
        const result = await FollowModel.follow(numericUserId, payload.userId);
        return NextResponse.json({following: result}, {status: 200});
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
    }
}

