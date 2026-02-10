'use client';

import {User} from "@/app/models";
import {useEffect, useState} from "react";

export default function ProfileTitleCard({user}: {user: User}) {

	const [followers, setFollowers] = useState<number>(0);

	const fetchFollowers = async () => {
		try {
			const res = await fetch(`/api/followers/count/${user.id}`);
			const data = await res.json();
			setFollowers(data.count);
		} catch (err) {
			console.error('Erreur lors de la récupération des followers:', err);
		}
	}

	useEffect(() => {
		fetchFollowers();
	}, [user]);

	return (
		<div className="flex flex-row mx-[2vw] gap-[1vw]">
			<img src={user?.picture || "https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder.png"} className="rounded-full w-[10vh] h-[10vh] object-cover" alt="" />
			<div className="flex flex-col">
				<p className="text-gray-700 text-4xl">{user?.name}</p>
				<p className="text-gray-400 text-lg">{followers || 0} followers</p>
			</div>
		</div>
	);
}