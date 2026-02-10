'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/app/lib/auth';

export default function Page() {
	const router = useRouter();
	const [users, setUsers] = useState<any[]>([]);

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
		<ul>
			{users.map(user => (
				<li key={user.id}>{user.name}</li>
			))}
		</ul>
	);
}