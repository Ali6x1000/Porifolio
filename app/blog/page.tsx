// in: app/blog/page.tsx

// REMOVED: import { motion } from 'framer-motion';
import BlogList from './BlogList'; // Import the Client Component

// Define the BlogPost interface here
interface BlogPost {
  id: string; title: string; excerpt: string; date: string; readTime: string; slug: string; tags: string[]; content: string; featuredImage?: string;
}

// This function runs on the server
async function getPosts(): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
}

// This is the corrected async Server Component
export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background pt-28 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* FIXED: Replaced motion.div with a regular div */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notes and tutorials on machine learning, the math behind it, and the systems I build.
          </p>
        </div>

        {posts.length === 0 ? (
          // FIXED: Replaced motion.div with a regular div
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
            <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          // This correctly uses the Client Component for the animated list
          <BlogList posts={posts} />
        )}
      </div>
    </div>
  );
}