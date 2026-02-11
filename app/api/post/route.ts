import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function GET(request: NextRequest) {
    try {
        await initDB();

        const posts = await PostModel.findAll();

        return NextResponse.json({
            users: posts.map(p => ({
                id: p.id,
                name: p.userId,
                email: p.content,
                picture: p.image,
                creation_date: p.creationDate,
                username: p.username,
            })),
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        );
    }
}

