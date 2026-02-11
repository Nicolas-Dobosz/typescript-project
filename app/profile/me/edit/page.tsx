'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import ProfileTitleCard from "@/app/components/profileTitleCard";
import ModifyProfileForm from "@/app/components/modifyProfileForm";
import {User} from "@/app/models";

export default function MyProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!auth.isAuthenticated()) {
			router.push('/login');
		} else {
			setUser(auth.getUser());
			setLoading(false);
		}
	}, [router]);

	if (loading) return null;

	return (
		<div className="min-h-screen flex flex-col bg-white py-4 gap-[5vh] px-[2vw]">
			<h1 className="text-black text-4xl">Votre profil</h1>

			<div className="flex flex-col gap-[1vh]">
				<div className="flex flex-row gap-2 items-center">
					<ProfileTitleCard user={user} />
				</div>
			</div>

			<ModifyProfileForm user={user} onUserUpdated={setUser} />
		</div>
	);
}
