import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {initDB} from '@/app/lib/db';
import {UserModel} from '@/app/models';
import {generateToken, verifyToken} from '@/app/lib/jwt';
import {PASSWORD_RULE_MESSAGE, validateEmail, validatePassword} from '@/app/lib/validations';

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

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
	try {
		await initDB();

		const {id} = await params;
		const userId = parseInt(id);
		if (isNaN(userId)) {
			return NextResponse.json({error: 'ID invalide'}, {status: 400});
		}

		const authHeader = request.headers.get('authorization') || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
		if (!token) {
			return NextResponse.json({error: 'Token manquant'}, {status: 401});
		}

		const payload = verifyToken(token);
		if (!payload || payload.userId !== userId) {
			return NextResponse.json({error: 'Non autorisé'}, {status: 403});
		}

		const body = await request.json();
		const {name, email, picture, actualEmail, password, newPassword} = body;

		if (!name || !email || !actualEmail || !password) {
			return NextResponse.json({error: 'Tous les champs requis sont obligatoires'}, {status: 400});
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return NextResponse.json({error: emailValidation.message || 'Email invalide'}, {status: 400});
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return NextResponse.json({error: passwordValidation.message || PASSWORD_RULE_MESSAGE}, {status: 400});
		}

		if (name.length < 3) {
			return NextResponse.json({error: "Le nom d'utilisateur doit contenir au moins 3 caractères"}, {status: 400});
		}

		const user = await UserModel.findById(userId);
		if (!user) {
			return NextResponse.json({error: 'Utilisateur non trouvé'}, {status: 404});
		}

		if (actualEmail !== user.email) {
			return NextResponse.json({error: 'Email actuel incorrect'}, {status: 401});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json({error: 'Mot de passe incorrect'}, {status: 401});
		}

		if (email !== user.email) {
			const existingUserByEmail = await UserModel.findByEmail(email);
			if (existingUserByEmail && existingUserByEmail.id !== userId) {
				return NextResponse.json({error: 'Cet email est déjà utilisé'}, {status: 400});
			}
		}

		if (name !== user.name) {
			const existingUserByName = await UserModel.findByName(name);
			if (existingUserByName && existingUserByName.id !== userId) {
				return NextResponse.json({error: "Ce nom d'utilisateur est déjà utilisé"}, {status: 400});
			}
		}

		const updateData: Record<string, unknown> = {
			name,
			email,
			picture: picture || null,
		};

		if (newPassword && newPassword.trim()) {
			updateData.password = await bcrypt.hash(newPassword, 10);
		}

		const updatedUser = await UserModel.update(userId, updateData);

		const newToken = generateToken({
			userId: updatedUser.id,
			email: updatedUser.email,
		});

		return NextResponse.json(
			{
				user: {
					id: updatedUser.id,
					name: updatedUser.name,
					email: updatedUser.email,
					picture: updatedUser.picture,
				},
				token: newToken,
			},
			{status: 200}
		);
	} catch (error) {
		console.error('Erreur lors de la mise à jour du profil:', error);
		return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
	}
}
