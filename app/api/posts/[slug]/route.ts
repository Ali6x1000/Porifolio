import { del, list } from '@vercel/blob';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const filePath = `posts/${slug}.json`;

    // 1. Find the blob to get its full URL
    const { blobs } = await list({ prefix: filePath });

    // 2. If the blob doesn't exist, we can't delete it
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 3. Extract the URL(s) and pass them to del()
    const urlsToDelete = blobs.map(blob => blob.url);
    await del(urlsToDelete);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}