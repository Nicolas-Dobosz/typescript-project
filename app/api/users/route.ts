import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {UserModel} from '@/app/models';

export async function GET(request: NextRequest) {
	try {
		await initDB();

		const users = await UserModel.findAll();

		return NextResponse.json({
			users: users.map(u => ({
				id: u.id,
				name: u.name,
				email: u.email,
				picture: u.picture,
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

