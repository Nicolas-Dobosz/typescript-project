'use client';

import {FormEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {auth} from '@/app/lib/auth';
import {PASSWORD_RULE_MESSAGE, validateEmail, validatePassword} from '@/app/lib/validations';

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (auth.isAuthenticated()) {
			router.push('/feed');
		}
	}, [router]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (!email || !password || !name) {
			setError('Tous les champs sont requis');
			return;
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			setError(passwordValidation.message || PASSWORD_RULE_MESSAGE);
			return;
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			setError(emailValidation.message || 'Email invalide');
			return;
		}

		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({email, password, name}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			auth.setAuth(data.token, data.user);

			router.push('/feed');
		} catch {
			setError('Erreur serveur');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<div className="w-full max-w-md p-8">
				<h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Inscription</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						placeholder="Nom d'utilisateur"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
					/>

					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
					/>

					<input
						type="password"
						placeholder="Mot de passe (min 9 caracteres, majuscule, chiffre, special)"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
					>
						S'inscrire
					</button>
				</form>

				<p className="mt-6 text-center text-gray-600">
					Déjà un compte ?
					<Link href="/login" className="text-blue-600 hover:underline font-semibold">
						Se connecter
					</Link>
				</p>
			</div>
		</div>
	);
}