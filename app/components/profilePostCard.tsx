'use client';

import {Post, User} from "@/app/models";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePostCard({post, user}: {post: Post; user: User}) {
	const [error, setError] = useState<string>("");
	const params = useParams();
	const userId = params.id; 
	const deletePost = async () => {
	
	try {
    	const res = await fetch("/api/deletePost", {
        	method: "POST",
        	headers: { "Content-Type": "application/json" },
        	body: JSON.stringify({ id: post.id }),
      	});

    	const data = await res.json();

		if (!res.ok) {
		setError(data.error);
		return;
		}
	
    } catch {
		setError("Erreur serveur");
    }
	}
	return (
		<div className="flex flex-col bg-gray-100 rounded-lg p-4">
			<div className="flex flex-row justify-between items-center w-full">
				<div className="flex flex-row gap-[8px] items-center">
					<img
						src={ user.picture || "https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder.png"}
						className="rounded-full w-[4vh] h-[4vh] object-cover"
						alt=""
					/>
					<p className="text-black text-lg">{user.name}</p>
				</div>
				<p className="text-black text-lg">{post.creationDate}</p>

			</div>
			<p className="text-gray-700">{post.content}</p>
			{post.image && (
				<img
					src={post.image || "https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder.png"}
					className="rounded-full w-[100%] h-[25vh] object-contain relative z-0"
					alt=""
				/>
			)}
			{!userId && <button className="text-black text-lg" type="button" onClick={deletePost}>Delete</button>}
		</div>
	);
}