'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';
import CreatPostModal from '../components/createPost';

export default function Page() {
	const router = useRouter();
	const [users, setUsers] = useState<any[]>([]);
	const [isModalOpen, setModalOpen] = useState<boolean>(false)

	const displayModal = () => {setModalOpen(true)}
	const closeModal = () => {setModalOpen(false)};

	useEffect(() => {

		if (!auth.isAuthenticated()) {
			router.push('/login');
			return;
		}

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
		</>
	);
}