'use client';

import {FormEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {auth} from '@/app/lib/auth';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (auth.isAuthenticated()) {
			router.push('/feed');
		}
	}, [router]);


	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Tous les champs sont requis');
			return;
		}

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({email, password}),
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
				<h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Connexion</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
					/>

					<input
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
					>
						Se connecter
					</button>
				</form>

				<p className="mt-6 text-center text-gray-600">
					Pas encore de compte ?{' '}
					<Link href="/register" className="text-blue-600 hover:underline font-semibold">
						S'inscrire
					</Link>
				</p>
			</div>
		</div>
	);
}

