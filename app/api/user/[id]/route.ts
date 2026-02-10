import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {UserModel} from '@/app/models';

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
	try {
		await initDB();

		const {id} = await params;
		const userId = parseInt(id);
		if (isNaN(userId)) {
			return NextResponse.json({error: 'ID invalide'}, {status: 400});
		}

		const user = await UserModel.findById(userId);

		if (!user) {
			return NextResponse.json({error: 'Utilisateur non trouvé'}, {status: 404});
		}

		return NextResponse.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				picture: user.picture,
			},
		});
	} catch (error) {
		console.error('Erreur:', error);
		return NextResponse.json(
			{error: 'Erreur serveur'},
			{status: 500}
		);
	}
}

