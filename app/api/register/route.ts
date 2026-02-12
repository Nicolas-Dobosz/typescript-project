import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {initDB} from '@/app/lib/db';
import {UserModel} from '@/app/models';
import {generateToken} from '@/app/lib/jwt';
import {PASSWORD_RULE_MESSAGE, validateEmail, validatePassword} from '@/app/lib/validations';

export async function POST(request: NextRequest) {
	try {
		await initDB();

		const body = await request.json();
		const {email, password, name} = body;

		if (!email || !password || !name) {
			return NextResponse.json(
				{error: 'Tous les champs sont requis'},
				{status: 400}
			);
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return NextResponse.json(
				{error: emailValidation.message || 'Email invalide'},
				{status: 400}
			);
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return NextResponse.json(
				{error: passwordValidation.message || PASSWORD_RULE_MESSAGE},
				{status: 400}
			);
		}

		if (name.length < 3) {
			return NextResponse.json(
				{error: "Le nom d'utilisateur doit contenir au moins 3 caractères"},
				{status: 400}
			);
		}

		const existingUserByEmail = await UserModel.findByEmail(email);

		if (existingUserByEmail) {
			return NextResponse.json(
				{error: 'Cet email est déjà utilisé'},
				{status: 400}
			);
		}

		const existingUserByName = await UserModel.findByName(name);

		if (existingUserByName) {
			return NextResponse.json(
				{error: "Ce nom d'utilisateur est déjà utilisé"},
				{status: 400}
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await UserModel.create({
			email,
			name,
			password: hashedPassword,
		});

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
					isAdmin: user.isAdmin,
				},
				token,
			},
			{status: 201}
		);
	} catch (error) {
		console.error('Erreur lors de l\'inscription:', error);
		return NextResponse.json(
			{error: 'Erreur serveur lors de l\'inscription'},
			{status: 500}
		);
	}
}