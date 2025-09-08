import { del, list } from '@vercel/blob';
import { NextResponse, NextRequest } from 'next/server';

// NEW: This function handles fetching a single post by its slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const filePath = `posts/${slug}.json`;

    // List blobs to find the correct URL for the given slug
    const { blobs } = await list({ prefix: filePath, limit: 1 });

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Fetch the JSON file's content directly from its public URL
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
        throw new Error('Failed to fetch blob content');
    }
    const postData = await response.json();

    return NextResponse.json(postData);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// EXISTING: This function handles deleting a single post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const filePath = `posts/${slug}.json`;

    const { blobs } = await list({ prefix: filePath });

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const urlsToDelete = blobs.map(blob => blob.url);
    await del(urlsToDelete);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}