import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - California Notary Exam Tips & Guides',
  description: 'Free articles about the California notary public exam, including study tips, latest changes, and step-by-step guides.',
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Notary Exam Blog</h1>
      <p className="text-gray-600 mb-8">Study tips, exam updates, and guides for California notary candidates.</p>
      <div className="space-y-6">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card block hover:border-blue-300 transition-colors">
            <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
            <div className="text-xs text-gray-400">
              {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
