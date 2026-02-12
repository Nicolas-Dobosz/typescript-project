'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import CreatPostModal from '../components/createPost';
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

	const [filter, setFilter] = useState<'following' | 'for-you' | 'recent'>('for-you');

	const onClickForYou = () => {
		setFilter('for-you');
	}
	const onClickFollows = () => {
		setFilter('following');
	}
	const onClickRecent = () => {
		setFilter('recent');
	}

	const calculatePostPoints = (post: Post): number => {
		const basePoints = 10;
		const likePoints = post.likeCount * 2;
		console.log(likePoints)
		const ageInHours = (Date.now() - new Date(post.creationDate).getTime()) / (1000 * 60 * 60);
		console.log(ageInHours)
		const agePoints = Math.max(0, 20 - ageInHours);

		return basePoints + likePoints + agePoints;
	}


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

	useEffect(() => {
		if (filter === "for-you" || filter === "recent") {
			fetch('/api/posts')
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
		}

		if (filter === "following") {
			console.log('/api/posts/following/'+auth.getUser().id)
			fetch('/api/posts/following/'+auth.getUser().id)
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

			console.log("ok")
		}


	}, [filter]);



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
				<div className="flex flex-row items-center w-full max-w-2xl gap-[1vw]">
					<button
						onClick={onClickFollows}
						className={`transition-all rounded-lg px-[1vw] py-[1vh] ${
							filter === 'following' 
								? 'bg-white text-indigo-900 border-2 border-indigo-500' 
								: 'bg-indigo-500 hover:bg-indigo-900 text-white'
						}`}
					>
						Suivis
					</button>
					<button
						onClick={onClickForYou}
						className={`transition-all rounded-lg px-[1vw] py-[1vh] ${
							filter === 'for-you' 
								? 'bg-white text-indigo-900 border-2 border-indigo-500' 
								: 'bg-indigo-500 hover:bg-indigo-900 text-white'
						}`}
					>
						Pour toi
					</button>
					<button
						onClick={onClickRecent}
						className={`transition-all rounded-lg px-[1vw] py-[1vh] ${
							filter === 'recent'
								? 'bg-white text-indigo-900 border-2 border-indigo-500'
								: 'bg-indigo-500 hover:bg-indigo-900 text-white'
						}`}
					>
						Récents
					</button>
				</div>
			{posts
				.sort((a, b) => {
					if (filter === 'recent') {
						return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
					}
					else {
						return calculatePostPoints(b) - calculatePostPoints(a);
					}
				})
				.map(post => (
					<div key={post.id}>
						{filter !== 'recent' && (
							<p className="text-purple-500">{calculatePostPoints(post)} points</p>
						)}
						<PostCard
							postId={post.id}
							author={post.username}
              authorId={post.userId}
							title={post.content}
							image={post.image || 'https://media.istockphoto.com/id/1500645450/fr/photo/image-floue-de-mouvement-de-la-circulation-sur-lautoroute.jpg?s=1024x1024&w=is&k=20&c=Kk2o63jL7LXfCs1MGT7NdeKldSQ-PXEAZYu0TJ_peH4='}
							likes={post.likeCount}
							isLiked={post.isLikedByUser}
              isAuthorFollowed={post.isAuthorFollowed}
						/>
					</div>
				))}
			</div>
		</>
	);
	
}