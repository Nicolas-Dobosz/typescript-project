import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await initDB();

        const { userId } = await params;
        const numericUserId = parseInt(userId, 10);

        if (Number.isNaN(numericUserId)) {
            return NextResponse.json({ error: 'UserId invalide' }, { status: 400 });
        }

        console.log("Recherche en BDD pour l'user ID:", numericUserId);

        const posts = await PostModel.findByUserId(numericUserId);

        return NextResponse.json({ posts });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}