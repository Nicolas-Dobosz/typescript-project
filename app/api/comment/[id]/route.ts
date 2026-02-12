import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/app/lib/db';
import { CommentModel } from '@/app/models';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDB();
        const { id } = await params;
        const numericId = parseInt(id, 10)

        const comment = await CommentModel.findById(numericId); 

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        await CommentModel.delete(numericId);

        return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}