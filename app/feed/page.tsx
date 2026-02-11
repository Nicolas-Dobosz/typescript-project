'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import CreatPostModal from '../components/createPost';
import MyButton from '../components/Button';
import PostCard from '../components/PostCard';
import {Post, User} from "@/app/models";
import {EnrichPost} from "@/app/models/Post";

export default function Page() {
	const router = useRouter();
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

	const displayModal = () => {setModalOpen(true)}
	const closeModal = () => {setModalOpen(false)};
	const [users, setUsers] = useState<User[]>([]);
	const [posts, setPosts] = useState<EnrichPost[]>([]);


	useEffect(() => {

		if (!auth.isAuthenticated()) {
			router.push('/login');
			return;
		}

		fetch('/api/posts', {
			headers: {
				'Authorization': `Bearer ${auth.getToken()}`
			}
		})
			.then(res => {
				if (!res.ok) throw new Error('Réponse serveur non-JSON');
				return res.json();
			})
			.then(data => {
				setPosts(data.posts || []);
			})
			.catch(error => {
				console.error("Erreur de fetch :", error);
			});



		fetch('/api/users')
			.then(res => res.json())
			.then(data => {
				setUsers(data.users || []);
				console.log(data.users);
			})
			.catch(error => {
				console.error(error);
			});
	}, [router]);



	return (
		<>	
			{isModalOpen && <CreatPostModal onClose={closeModal}/> }
			<button onClick={displayModal}>New Post</button>
			<ul>
				{users.map(user => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
			<div className="flex flex-col justify-center items-center gap-6">
			{posts.map(post => (
				<PostCard 
					key={post.id}
					postId={post.id}
					authorId={post.userId}
					author={post.username}
					title={post.content}
					image={post.image || 'https://media.istockphoto.com/id/1500645450/fr/photo/image-floue-de-mouvement-de-la-circulation-sur-lautoroute.jpg?s=1024x1024&w=is&k=20&c=Kk2o63jL7LXfCs1MGT7NdeKldSQ-PXEAZYu0TJ_peH4='}
					likes={post.likeCount}
					isLiked={post.isLikedByUser}
					isAuthorFollowed={post.isAuthorFollowed}
				/>
			))}
			</div>
		</>
	);
	
}