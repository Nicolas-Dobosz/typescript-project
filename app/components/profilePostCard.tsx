'use client';

import {Post} from "@/app/models";

export default function ProfilePostCard({post}: {post: Post}) {

	return (
		<div className="flex flex-col bg-gray-100 rounded-lg p-4">
			<div className="flex flex-row justify-between items-center w-full">
				<div className="flex flex-row gap-[8px] items-center">
					<img
						src="https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder.png"
						className="rounded-full w-[4vh] h-[4vh] object-cover"
						alt=""
					/>
					<p className="text-black text-lg">Auteur</p>
				</div>
				<p className="text-black text-lg">Date</p>

			</div>
			<p className="text-gray-700">Content</p>
			{post.image && (
				<img
					src="https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder.png"
					className="rounded-full w-[100%] h-[25vh] object-contain"
					alt=""
				/>
			)}
		</div>
	);
}