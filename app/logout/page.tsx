'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';

export default function LogoutPage() {
	const router = useRouter();

	useEffect(() => {
		auth.logout();
		router.push('/login');
	}, [router]);



	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<p className="text-black">Déconnexion en cours...</p>
		</div>
	);
}

