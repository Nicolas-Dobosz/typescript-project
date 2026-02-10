import {dbAll, dbGet, dbRun} from '@/app/lib/db';
import {LikeModel} from './Like';
import { User } from './User';

export interface Post {
	id: number;
	username: User;
	content: string;
	image: string | null;
	creationDate: string;
	likeCount: number;
	isLikedByUser: boolean;
}

export const PostModel = {
	async create(data: { userId: number; content: string; image?: string }): Promise<Post> {
		const result = await dbRun(
			'INSERT INTO post (userId, content, image) VALUES (?, ?, ?)',
			[data.userId, data.content, data.image || null]
		);

		const post = await dbGet<Post>('SELECT * FROM post WHERE id = ?', [result.lastID]);
		if (!post) throw new Error('Erreur lors de la création du post');
		return {
			...post,
			likeCount: 0,
			isLikedByUser: false,
		};
	},

	async findById(id: number, currentUserId?: number): Promise<Post> {
		const post = await dbGet<Post>('SELECT * FROM post WHERE id = ?', [id]);
		if (!post) throw new Error('Post non trouvé');
		return {
			...post,
			likeCount: await LikeModel.countByPostId(post.id),
			isLikedByUser: currentUserId ? await LikeModel.exists(currentUserId, post.id) : false,
		};
	},

	async findAll(currentUserId?: number): Promise<Post[]> {
		const posts = await dbAll<Post>('SELECT * FROM post', []);
		return Promise.all(
			posts.map(async (post) => ({
				...post,
				likeCount: await LikeModel.countByPostId(post.id),
				isLikedByUser: currentUserId ? await LikeModel.exists(currentUserId, post.id) : false,
			}))
		);
	},

	async findByUserId(userId: number, currentUserId?: number): Promise<Post[]> {
		const posts = await dbAll<Post>('SELECT * FROM post WHERE userId = ?', [userId]);
		return Promise.all(
			posts.map(async (post) => ({
				...post,
				likeCount: await LikeModel.countByPostId(post.id),
				isLikedByUser: currentUserId ? await LikeModel.exists(currentUserId, post.id) : false,
			}))
		);
	},

	async update(id: number, data: any): Promise<Post> {
		const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
		await dbRun(`UPDATE post SET ${fields} WHERE id = ?`, [...Object.values(data), id]);
		const post = await this.findById(id);
		if (!post) throw new Error('Post non trouvé');
		return post;
	},

	async delete(id: number): Promise<void> {
		await dbRun('DELETE FROM post WHERE id = ?', [id]);
		await LikeModel.deleteForPost(id);
	},
};

