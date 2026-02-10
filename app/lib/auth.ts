export const auth = {
	getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('token');
	},

	getUser(): any | null {
		if (typeof window === 'undefined') return null;
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	},

	isAuthenticated(): boolean {
		return !!this.getToken();
	},

	logout() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		window.location.href = '/login';
	},

	setAuth(token: string, user: any) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
	},
};

