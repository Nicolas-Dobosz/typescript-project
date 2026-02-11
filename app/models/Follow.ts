import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface Follow {
	id: number;
	userId: number;
	followerId: number;
}

export const FollowModel = {
	async create(followedId: number, followerId: number): Promise<Follow> {
		const result = await dbRun(
			'INSERT INTO follow (userId, followerId) VALUES (?, ?)',
			[followedId, followerId]
		);

		const follow = await dbGet<Follow>('SELECT * FROM follow WHERE id = ?', [result.lastID]);
		if (!follow) throw new Error('Erreur lors de la création du follow');
		return follow;
	},

	async exists(followedId: number, followerId: number): Promise<boolean> {
		const follow = await dbGet<Follow>(
			'SELECT * FROM follow WHERE userId = ? AND followerId = ?',
			[followedId, followerId]
		);
		return !!follow;
	},

	async getFollowers(followedId: number): Promise<Follow[]> {
		return await dbAll<Follow>('SELECT * FROM follow WHERE userId = ?', [followedId]);
	},

	async getFollowing(followerId: number): Promise<Follow[]> {
		return await dbAll<Follow>('SELECT * FROM follow WHERE followerId = ?', [followerId]);
	},

	async countFollowers(followedId: number): Promise<number> {
		const result = await dbGet<{ count: number }>(
			'SELECT COUNT(*) as count FROM follow WHERE userId = ?',
			[followedId]
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

	async follow(followedId: number, followerId: number) {
		if (await this.exists(followedId, followerId)) {
			await this.delete(followedId, followerId);
		}
		else {
			await this.create(followedId, followerId);
		}
		return await this.exists(followedId, followerId);
	},

	async delete(followedId: number, followerId: number): Promise<void> {
		await dbRun('DELETE FROM follow WHERE userId = ? AND followerId = ?', [followedId, followerId]);
	},
};

