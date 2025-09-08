import { put, list } from '@vercel/blob';
import { NextResponse, NextRequest } from 'next/server';

// GET all blog posts
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'posts/' });
    
    const posts = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        return await response.json();
      })
    );
    
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// CREATE or UPDATE a blog post
export async function POST(request: NextRequest) {
  try {
    const post = await request.json();
    if (!post.slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await put(`posts/${post.slug}.json`, JSON.stringify(post, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}