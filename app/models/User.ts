import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	picture: string | null;
	isAdmin: number;
}

export const UserModel = {
	async create(data: { name: string; email: string; password: string; picture?: string }): Promise<User> {
		const result = await dbRun(
			'INSERT INTO user (name, email, password, picture) VALUES (?, ?, ?, ?)',
			[data.name, data.email, data.password, data.picture || null]
		);

		const user = await dbGet<User>('SELECT * FROM user WHERE id = ?', [result.lastID]);
		if (!user) throw new Error('Erreur lors de la création de l\'utilisateur');
		return user;
	},

	async findByEmail(email: string): Promise<User | undefined> {
		return await dbGet<User>('SELECT * FROM user WHERE email = ?', [email]);
	},

	async findByName(name: string): Promise<User | undefined> {
		return await dbGet<User>('SELECT * FROM user WHERE name = ?', [name]);
	},

	async findById(id: number): Promise<User | undefined> {
		return await dbGet<User>('SELECT * FROM user WHERE id = ?', [id]);
	},

	async findAll(): Promise<User[]> {
		return await dbAll<User>('SELECT * FROM user');
	},

	async update(id: number, data: any): Promise<User> {
		const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
		await dbRun(`UPDATE user
                     SET ${fields}
                     WHERE id = ?`, [...Object.values(data), id]);
		const user = await this.findById(id);
		if (!user) throw new Error('Utilisateur non trouvé');
		return user;
	},


	async delete(id: number): Promise<void> {
		await dbRun('DELETE FROM user WHERE id = ?', [id]);
	},
};

