import { notFound } from 'next/navigation';
import PostContent from './PostContent'; // Import the new Client Component

// Define the BlogPost interface here
interface BlogPost {
  id: string; title: string; excerpt: string; date: string; readTime: string; slug: string; tags: string[]; content: string; featuredImage?: string;
}

// This function fetches data on the server
async function getPost(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${slug}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

// This is the async Server Component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostContent post={post} />
      </div>
    </article>
  );
}