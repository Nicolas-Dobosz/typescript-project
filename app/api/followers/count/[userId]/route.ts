import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {FollowModel, UserModel} from '@/app/models';

export async function GET(request: NextRequest, {params}: {params: {userId: string}}) {
	try {
		await initDB();

		const {userId} = params;

		const follows = await FollowModel.getFollowers(parseInt(userId));

		const followers = await Promise.all(
			follows.map(async follow => {
				const user = await UserModel.findById(follow.followerId);
				return {
					id: user?.id,
					name: user?.name,
					email: user?.email,
					picture: user?.picture,
				};
			})
		);

		return NextResponse.json({followers}, {status: 200});
	} catch (error) {
		console.error('Erreur:', error);
		return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
	}
}

