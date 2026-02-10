import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface Follow {
	id: number;
	userId: number;
	followerId: number;
}

export const FollowModel = {
	async create(userId: number, followerId: number): Promise<Follow> {
		const result = await dbRun(
			'INSERT INTO follow (userId, followerId) VALUES (?, ?)',
			[userId, followerId]
		);

		const follow = await dbGet<Follow>('SELECT * FROM follow WHERE id = ?', [result.lastID]);
		if (!follow) throw new Error('Erreur lors de la création du follow');
		return follow;
	},

	async exists(userId: number, followerId: number): Promise<boolean> {
		const follow = await dbGet<Follow>(
			'SELECT * FROM follow WHERE userId = ? AND followerId = ?',
			[userId, followerId]
		);
		return !!follow;
	},

	async getFollowers(userId: number): Promise<Follow[]> {
		return await dbAll<Follow>('SELECT * FROM follow WHERE userId = ?', [userId]);
	},

	async getFollowing(followerId: number): Promise<Follow[]> {
		return await dbAll<Follow>('SELECT * FROM follow WHERE followerId = ?', [followerId]);
	},

	async countFollowers(userId: number): Promise<number> {
		const result = await dbGet<{ count: number }>(
			'SELECT COUNT(*) as count FROM follow WHERE userId = ?',
			[userId]
		);
		return result?.count || 0;
	},

	async countFollowing(followerId: number): Promise<number> {
		const result = await dbGet<{ count: number }>(
			'SELECT COUNT(*) as count FROM follow WHERE followerId = ?',
			[followerId]
		);
		return result?.count || 0;
	},

	async delete(userId: number, followerId: number): Promise<void> {
		await dbRun('DELETE FROM follow WHERE userId = ? AND followerId = ?', [userId, followerId]);
	},
};

