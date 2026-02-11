import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface Post {
	id: number;
	userId: number;
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
		return await dbAll<Post>('SELECT * FROM post ORDER BY creationDate DESC');
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

