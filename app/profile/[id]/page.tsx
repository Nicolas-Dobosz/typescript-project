'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import ProfileTitleCard from "@/app/components/profileTitleCard";
import ProfilePostList from "@/app/components/profilePostList";

export default function UserProfilePage() {
	const router = useRouter();
	const params = useParams();
	const userId = params.id;
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!auth.isAuthenticated()) {
			router.push('/login');
		} else if (!userId) {
			router.push('/profile/me');
		} else {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		if (userId && !loading) {
			const getUserInfo = async () => {
				try {
					const res = await fetch(`/api/user/${userId}`);
					const data = await res.json();

					if (!res.ok) {
						console.error('Erreur API:', data.error);
						router.push('/profile/me');
						return;
					}

					if (data.user && Object.keys(data.user).length > 0) {
						setUser(data.user);
					} else {
						router.push('/profile/me');
					}
				} catch (err) {
					console.error('Erreur lors de la récupération des informations utilisateur:', err);
					router.push('/profile/me');
				}
			};
			getUserInfo();
		}
	}, [userId, loading, router]);

	if (loading || !user) return null;

	return (
		<div className="min-h-screen flex flex-col bg-white py-4 gap-[5vh] px-[2vw]">
			<h1 className="text-black text-4xl">Profil de {user?.name}</h1>

			<div className="flex flex-col gap-[1vh]">
				<ProfileTitleCard  user={user} />
			</div>

			<div>
				<h2 className="text-black text-2xl">Posts</h2>

				<ProfilePostList user={user}/>
			</div>
		</div>
	);
}

