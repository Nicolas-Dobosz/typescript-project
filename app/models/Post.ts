import {dbAll, dbGet, dbRun} from '@/app/lib/db';
import { User } from './User';

export interface Post {
	id: number;
	username: User;
	content: string;
	image: string | null;
	creationDate: string;
}

export const PostModel = {
	async create(data: { userId: number; content: string; image?: string }): Promise<Post> {
		const result = await dbRun(
			'INSERT INTO post (userId, content, image) VALUES (?, ?, ?)',
			[data.userId, data.content, data.image || null]
		);

		const post = await dbGet<Post>('SELECT * FROM post WHERE id = ?', [result.lastID]);
		if (!post) throw new Error('Erreur lors de la création du post');
		return post;
	},

	async findById(id: number): Promise<Post | undefined> {
		return await dbGet<Post>('SELECT * FROM post WHERE id = ?', [id]);
	},

	async findAll(): Promise<Post[]> {
		
		return await dbAll<Post>('SELECT post.*, user.name as authorName FROM post INNER JOIN user ON post.userId = user.id ORDER BY post.creationDate DESC');
	},

	async findByUserId(userId: number): Promise<Post[]> {
		return await dbAll<Post>('SELECT * FROM post WHERE userId = ? ORDER BY creationDate DESC', [userId]);
	},

	async update(id: number, data: any): Promise<Post> {
		const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
		await dbRun(`UPDATE post
                     SET ${fields}
                     WHERE id = ?`, [...Object.values(data), id]);
		const post = await this.findById(id);
		if (!post) throw new Error('Post non trouvé');
		return post;
	},

	async delete(id: number): Promise<void> {
		await dbRun('DELETE FROM post WHERE id = ?', [id]);
	},
};

