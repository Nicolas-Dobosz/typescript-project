import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function POST(request: NextRequest) {

	try {
		await initDB();

		const body = await request.json();
		const {userId,content, url} = body;
		
		if (!content || !url) {
			return NextResponse.json(
				{error: 'Content and image url required'},
				{status: 400}
			);
		}
		const post = await PostModel.create({userId, content, image: url});

		if (!post) {
			return NextResponse.json(
				{error: 'Error in the fields'},
				{status: 401}
			);
		}

		return NextResponse.json(
			{status: 200}
		);
	} catch (error) {
		console.error('Error while connecting:', error);
		return NextResponse.json(
			{error: 'Error while connecting to the server'},
			{status: 500}
		);
	}
}