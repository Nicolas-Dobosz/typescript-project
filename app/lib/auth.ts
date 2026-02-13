import {User} from "@/app/models";

export const auth = {
	getToken() {
		if (typeof window === 'undefined') return null;
		console.log("Token actuel:", localStorage.getItem('token'));
		const token = localStorage.getItem('token');
		return token || null;
	},

	getUser(): any | null {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	},

	getUserFromToken(token: string) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return {
				id: payload.id,
				name: payload.name,
				email: payload.email,
			} as User;
		} catch (e) {
			console.error("Erreur lors de la décodification du token:", e);
			return null;
		}
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

