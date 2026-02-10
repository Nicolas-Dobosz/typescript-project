import {dbAll, dbGet, dbRun} from '@/app/lib/db';

export interface Comment {
	id: number;
	userId: number;
	postId: number;
	content: string;
	creationDate: string;
}

export const CommentModel = {
	async create(data: { userId: number; postId: number; content: string }): Promise<Comment> {
		const result = await dbRun(
			'INSERT INTO comment (userId, postId, content) VALUES (?, ?, ?)',
			[data.userId, data.postId, data.content]
		);

		const comment = await dbGet<Comment>('SELECT * FROM comment WHERE id = ?', [result.lastID]);
		if (!comment) throw new Error('Erreur lors de la création du commentaire');
		return comment;
	},

	async findById(id: number): Promise<Comment | undefined> {
		return await dbGet<Comment>('SELECT * FROM comment WHERE id = ?', [id]);
	},

	async findByPostId(postId: number): Promise<Comment[]> {
		return await dbAll<Comment>('SELECT * FROM comment WHERE postId = ? ORDER BY creationDate ASC', [postId]);
	},

	async findByUserId(userId: number): Promise<Comment[]> {
		return await dbAll<Comment>('SELECT * FROM comment WHERE userId = ? ORDER BY creationDate DESC', [userId]);
	},

	async update(id: number, content: string): Promise<Comment> {
		await dbRun('UPDATE comment SET content = ? WHERE id = ?', [content, id]);
		const comment = await this.findById(id);
		if (!comment) throw new Error('Commentaire non trouvé');
		return comment;
	},

	async delete(id: number): Promise<void> {
		await dbRun('DELETE FROM comment WHERE id = ?', [id]);
	},
};

