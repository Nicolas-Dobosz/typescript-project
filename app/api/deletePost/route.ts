import {NextRequest, NextResponse} from 'next/server';
import {initDB} from '@/app/lib/db';
import {PostModel} from '@/app/models';

export async function POST(request: NextRequest) {

    try {
        await initDB();

        const body = await request.json();
        const {id} = body;
        
        if (!id) {
            return NextResponse.json(
                {error: 'Content and image url required'},
                {status: 400}
            );
        }
        const post = await PostModel.delete(id);
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