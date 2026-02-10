import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface Like {
	id: number;
	userId: number;
	postId: number;
}

export const LikeModel = {
	async create(userId: number, postId: number): Promise<Like> {
		const result = await dbRun(
			'INSERT INTO "like" (userId, postId) VALUES (?, ?)',
			[userId, postId]
		);

		const like = await dbGet<Like>('SELECT * FROM "like" WHERE id = ?', [result.lastID]);
		if (!like) throw new Error('Erreur lors de la création du like');
		return like;
	},

	async exists(userId: number, postId: number): Promise<boolean> {
		const like = await dbGet<Like>(
			'SELECT * FROM "like" WHERE userId = ? AND postId = ?',
			[userId, postId]
		);
		return !!like;
	},

	async findByPostId(postId: number): Promise<Like[]> {
		return await dbAll<Like>('SELECT * FROM "like" WHERE postId = ?', [postId]);
	},

	async findByUserId(userId: number): Promise<Like[]> {
		return await dbAll<Like>('SELECT * FROM "like" WHERE userId = ?', [userId]);
	},

	async countByPostId(postId: number): Promise<number> {
		const result = await dbGet<{ count: number }>(
			'SELECT COUNT(*) as count FROM "like" WHERE postId = ?',
			[postId]
		);
		return result?.count || 0;
	},

	async delete(userId: number, postId: number): Promise<void> {
		await dbRun('DELETE FROM "like" WHERE userId = ? AND postId = ?', [userId, postId]);
	},
};

