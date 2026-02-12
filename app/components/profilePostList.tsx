'use client';

import {Post, User} from "@/app/models";
import ProfilePostCard from "@/app/components/profilePostCard";
import {useEffect, useState} from "react";

export default function ProfilePostList({user}: {user: User}) {

	const [posts, setPosts] = useState<Post[]>([]);
	const [reloading, setReloading] = useState<boolean>(false)

	const fetchPosts = async () => {
		try {
			const res = await fetch(`/api/post/user/${user.id}`);
			const data = await res.json();
			setPosts(data.posts);
		} catch (err) {
			console.error('Erreur lors de la récupération des posts:', err);
		}
	}

	useEffect(() => {
		if(reloading){
			setReloading(false)
		}
		fetchPosts();
	}, [user, reloading]);

	return (
		<div className="flex flex-col gap-1 bg-white">
			{posts.map((post) => (
				<ProfilePostCard post={post} key={post.id} user={user} setReloading={setReloading} />
			))}
		</div>
	);
}