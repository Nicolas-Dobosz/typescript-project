import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function GET(request: NextRequest, {params}: {params: Promise<{userId: number}>}) {
	try {
		await initDB();

		const {userId} = await params;

		const posts = await PostModel.findPostsFollowersByUserId(userId, userId);
		return NextResponse.json({
			posts: posts.map(p => ({
				id: p.id,
				username: p.username,
				content: p.content,
				image: p.image,
				creationDate: p.creationDate,
				likeCount: p.likeCount,
				isLikedByUser: p.isLikedByUser,
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

