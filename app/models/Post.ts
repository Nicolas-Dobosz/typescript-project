import {dbAll, dbGet, dbRun} from '@/app/lib/db';
import {LikeModel} from './Like';
import {UserModel} from './User';
import {FollowModel} from "@/app/models/Follow";

export interface Post {
	id: number;
	userId: number;
	content: string;
	image: string | null;
	creationDate: string;
}

export interface EnrichPost extends Post {
	likeCount: number;
	isLikedByUser: boolean;
	username: string;
	isAuthorFollowed: boolean;
}

export const PostModel = {
	async enrichPost(post: any, currentUserId?: number): Promise<EnrichPost> {
		const user = await UserModel.findById(post.userId);
		return {
			...post,
			likeCount: await LikeModel.countByPostId(post.id),
			isLikedByUser: currentUserId ? await LikeModel.exists(currentUserId, post.id) : false,
			username: user?.name || 'Inconnu',
			isAuthorFollowed: currentUserId ? await FollowModel.exists(post.userId, currentUserId) : false,
		};
	},

	async create(data: { userId: number; content: string; image?: string }): Promise<EnrichPost> {
		const result = await dbRun(
			'INSERT INTO post (userId, content, image) VALUES (?, ?, ?)',
			[data.userId, data.content, data.image || null]
		);

		const post = await dbGet<Post>('SELECT * FROM post WHERE id = ?', [result.lastID]);
		if (!post) throw new Error('Error creating the post');
		return this.enrichPost(post);
	},

	async findById(id: number, currentUserId?: number): Promise<EnrichPost> {
		const post = await dbGet<Post>('SELECT * FROM post WHERE id = ?', [id]);
		if (!post) throw new Error('Post non trouvé');
		return this.enrichPost(post, currentUserId);
	},

	async findAll(currentUserId?: number, limit: number=10, offset: number=0): Promise<Post[]> {
		const posts = await dbAll<Post>('SELECT * FROM post ORDER BY post.creationDate DESC LIMIT ? OFFSET ?', 
			[limit, offset]
		);
		return Promise.all(posts.map(post => this.enrichPost(post, currentUserId)));
	},

	async findByUserId(userId: number, currentUserId?: number): Promise<EnrichPost[]> {
		const posts = await dbAll<Post>('SELECT * FROM post WHERE userId = ?', [userId]);
		return Promise.all(posts.map(post => this.enrichPost(post, currentUserId)));
	},

	async findPostsFollowersByUserId(userId: number, currentUserId?: number): Promise<Post[]> {
		console.log("===== DEBUG findPostsFollowersByUserId =====");
		console.log("userId (followerId):", userId, "type:", typeof userId);
		console.log("currentUserId:", currentUserId);

		const query = `SELECT post.* FROM post 
			INNER JOIN follow ON post.userId = follow.userId 
			WHERE follow.followerId = ?
			ORDER BY post.creationDate DESC`;

		console.log("SQL Query:", query);
		console.log("Paramètres:", [userId]);

		const posts = await dbAll<Post>(query, [userId]);

		console.log("Posts bruts de la requête SQL:", posts);
		console.log("Nombre de posts bruts:", posts.length);

		return Promise.all(posts.map(post => this.enrichPost(post, currentUserId)));
	},

	async update(id: number, data: any): Promise<Post> {
		const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
		await dbRun(`UPDATE post SET ${fields} WHERE id = ?`, [...Object.values(data), id]);
		const post = await this.findById(id);
		if (!post) throw new Error('Post non trouvé');
		return post;
	},

	async updateLike(id: number, currentUserId: number): Promise<EnrichPost> {
		if (await LikeModel.exists(currentUserId, id)) {
			await LikeModel.delete(currentUserId, id)
		} else {
			await LikeModel.create(currentUserId, id);
		}
		return this.findById(id, currentUserId);
	},

	async delete(id: number): Promise<void> {
		await dbRun('DELETE FROM post WHERE id = ?', [id]);
		await LikeModel.deleteForPost(id);
	},

	async findPostDetailById(id: number): Promise<any> {
        // 1. On récupère le post et l'auteur
        const postWithAuthor = await dbGet<any>(`
            SELECT p.*, u.name as authorName, u.picture as authorPicture
            FROM post p
            JOIN user u ON p.userId = u.id
            WHERE p.id = ?
        `, [id]);

        if (!postWithAuthor) return null;

        // 2. On récupère les commentaires liés avec le prénom (name) de chaque commentateur
        const comments = await dbAll<any>(`
            SELECT c.*, u.name as commenterName
            FROM comment c
            JOIN user u ON c.userId = u.id
            WHERE c.postId = ?
            ORDER BY c.creationDate ASC
        `, [id]);

        // 3. On fusionne le tout dans un seul objet
        return {
            ...postWithAuthor,
            comments: comments
        };
    },
};

