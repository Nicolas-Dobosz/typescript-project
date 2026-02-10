'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import ProfileTitleCard from "@/app/components/profileTitleCard";
import ProfilePostList from "@/app/components/profilePostList";

export default function MyProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!auth.isAuthenticated()) {
			router.push('/login');
		} else {
			setUser(auth.getUser());
			console.log(auth.getUser());
			setLoading(false);
		}
	}, [router]);

	if (loading) return null;

	return (
		<div className="min-h-screen flex flex-col bg-white py-4 gap-[5vh] px-[2vw]">
			<h1 className="text-black text-4xl">Votre profil</h1>

			<div className="flex flex-col gap-[1vh]">

				<ProfileTitleCard  user={user} />

				<div className="flex flex-col pl-[2vw]">
					<h2 className="text-black text-2xl">Informations</h2>
					<p className="text-gray-700">Email: {user?.email}</p>
					<p className="text-gray-700">Rôle: {user?.isAdmin}</p>
				</div>
			</div>

			<div>
				<h2 className="text-black text-2xl">Vos posts</h2>

				<ProfilePostList user={user}/>


			</div>
		</div>
	);
}

