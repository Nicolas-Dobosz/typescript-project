import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';
import {verifyToken} from '@/app/lib/jwt';

export async function GET(request: NextRequest) {
	try {
		await initDB();
		const {searchParams} = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limit = 10;
		const offset = (page - 1) * limit;

		const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({error: 'Token manquant'}, {status: 401});
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({error: 'Token invalide'}, {status: 401});
        }

		const posts = await PostModel.findAll(payload.userId, limit, offset);

		

		return NextResponse.json({
			posts: posts.map(p => ({
				id: p.id,
				userId: p.userId,
				username: p.username,
				content: p.content,
				image: p.image,
				creationDate: p.creationDate,
				likeCount: Number(p.likeCount) || 0,
				isLikedByUser: Boolean(p.isLikedByUser),
				picture: p.creationDate,
				isAuthorFollowed: p.isAuthorFollowed,
			})),
			hasMore: posts.length === limit,
		});
	} catch (error) {
		console.error('Erreur:', error);
		return NextResponse.json(
			{error: 'Erreur serveur'},
			{status: 500}
		);
	}
}

