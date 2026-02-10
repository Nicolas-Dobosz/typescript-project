import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {initDB} from '@/app/lib/db';
import {UserModel} from '@/app/models';
import {generateToken} from '@/app/lib/jwt';

export async function POST(request: NextRequest) {
	try {
		await initDB();

		const body = await request.json();
		const {email, password} = body;

		if (!email || !password) {
			return NextResponse.json(
				{error: 'Email et mot de passe requis'},
				{status: 400}
			);
		}

		const user = await UserModel.findByEmail(email);

		if (!user) {
			return NextResponse.json(
				{error: 'Email ou mot de passe incorrect'},
				{status: 401}
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{error: 'Email ou mot de passe incorrect'},
				{status: 401}
			);
		}

		const token = generateToken({
			userId: user.id,
			email: user.email,
		});

		return NextResponse.json(
			{
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					picture: user.picture,
				},
				token,
			},
			{status: 200}
		);
	} catch (error) {
		console.error('Erreur lors de la connexion:', error);
		return NextResponse.json(
			{error: 'Erreur serveur lors de la connexion'},
			{status: 500}
		);
	}
}