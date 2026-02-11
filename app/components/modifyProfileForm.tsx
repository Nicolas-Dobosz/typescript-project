'use client';

import {useEffect, useState} from 'react';
import {auth} from '@/app/lib/auth';
import {PASSWORD_RULE_MESSAGE, validateEmail, validatePassword} from '@/app/lib/validations';
import {User} from '@/app/models';

type ModifyProfileFormProps = {
	user: User | null;
	onUserUpdated?: (user: User) => void;
};

export default function ModifyProfileForm({user, onUserUpdated}: ModifyProfileFormProps) {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [newConfirmPassword, setNewConfirmPassword] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [picture, setPicture] = useState<string>('');
	const [actualEmail, setActualEmail] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		setName(user?.name || '');
		setEmail(user?.email || '');
		setPicture(user?.picture || '');
	}, [user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		// validations
		if (!name.trim()) {
			setError('Le nom est requis');
			return;
		}

		if (!email.trim()) {
			setError('L\'email est requis');
			return;
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			setError(emailValidation.message || 'Format d\'email invalide');
			return;
		}

		if (!actualEmail.trim()) {
			setError('Votre email actuel est requis');
			return;
		}

		if (!password.trim()) {
			setError('Votre mot de passe actuel est requis');
			return;
		}
		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			setError(passwordValidation.message || PASSWORD_RULE_MESSAGE);
			return;
		}

		const hasNewPassword = !!newPassword.trim() || !!newConfirmPassword.trim();
		if (hasNewPassword) {
			if (!newPassword.trim() || !newConfirmPassword.trim()) {
				setError('Le nouveau mot de passe et la confirmation sont requis');
				return;
			}

			if (newPassword !== newConfirmPassword) {
				setError('Les mots de passe ne correspondent pas');
				return;
			}

			const newPasswordValidation = validatePassword(newPassword);
			if (!newPasswordValidation.valid) {
				setError(newPasswordValidation.message || PASSWORD_RULE_MESSAGE);
				return;
			}
		}

		if (!user?.id) {
			setError('Utilisateur introuvable');
			return;
		}

		const token = auth.getToken();
		if (!token) {
			setError('Vous devez être connecté');
			return;
		}

		try {
			const res = await fetch(`/api/user/${user.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					name,
					email,
					picture: picture.trim() ? picture : null,
					actualEmail,
					password,
					newPassword: hasNewPassword ? newPassword : undefined,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Erreur serveur');
				return;
			}

			auth.setAuth(data.token, data.user);
			onUserUpdated?.(data.user);
			setPassword('');
			setActualEmail('');
			setNewPassword('');
			setNewConfirmPassword('');
		} catch {
			setError('Erreur serveur');
		}
	};

	return (
		<div>
			<h2 className="text-black text-2xl">Modifier vos informations</h2>

			{error && (
				<div className="my-[2vh] p-3 bg-red-50 border border-red-200 text-red-700 rounded">
					{error}
				</div>
			)}

			<form className="flex flex-col gap-[1vh] ml-[1vw]" onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<label htmlFor="newName" className="text-black">Nouveau nom</label>
					<input
						id="newName"
						type="text"
						placeholder="xxpseudoSuper_xx"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="newEmail" className="text-black">Nouvel e-mail</label>
					<input
						id="newEmail"
						type="email"
						placeholder="test@gmail.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-[2vh] gap-[2vw]">
					<div className="flex flex-col">
						<label htmlFor="newPassword" className="text-black">Nouveau mot de passe</label>
						<input
							id="newPassword"
							type="password"
							placeholder="Nouveau mot de passe"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="newConfirmPassword" className="text-black">Confirmer le nouveau mot de passe</label>
						<input
							id="newConfirmPassword"
							type="password"
							placeholder="Confirmer le mot de passe"
							value={newConfirmPassword}
							onChange={(e) => setNewConfirmPassword(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<label htmlFor="newPicture" className="text-black">Nouvelle photo de profil (URL)</label>
					<input
						id="newPicture"
						type="url"
						placeholder="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAbCH85-XTGMTpYRXNJ5ncQF7qjZ6sfK733_-uN0Gy8lO3HQ8F47X3xXBJGobW24Nsg_e1NYvoIFPRuCe1020oVA5kDERYZbzPpR7m9iPESQ&s=10"
						value={picture}
						onChange={(e) => setPicture(e.target.value)}
						className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<h3 className="text-black text-2xl mt-[2vh]">Valider vos informations de connexion pour valider</h3>

				<div className="flex flex-col ml-[1vw]">
					<label htmlFor="email" className="text-black">Votre e-mail actuelle</label>
					<input
						id="email"
						type="email"
						placeholder="test@gmail.com"
						value={actualEmail}
						onChange={(e) => setActualEmail(e.target.value)}
						className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex flex-col ml-[1vw]">
					<label htmlFor="password" className="text-black">Votre mot de passe actuel</label>
					<input
						id="password"
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<button
					type="submit"
					disabled={!actualEmail || !password}
					className={`transition-all rounded-lg px-[1vw] py-[1vh] font-semibold ${!actualEmail || !password ? 'bg-gray-400 cursor-not-allowed text-gray-600' : 'bg-green-500 hover:bg-green-700 text-white'}`}
				>
					Enregistrer les modifications
				</button>
			</form>
		</div>
	);
}
