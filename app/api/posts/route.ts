import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function GET(request: NextRequest) {
	try {
		await initDB();

		const posts = await PostModel.findAll();

		return NextResponse.json({
			posts: posts.map(p => ({
				id: p.id,
				username: p.username,
				content: p.content,
				image: p.image,
				picture: p.creationDate,
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

