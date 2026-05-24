import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Blog
      </Link>
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <div className="text-sm text-gray-400 mb-8">
        {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {' '}&middot;{' '}{post.author}
      </div>
      <div className="prose prose-gray max-w-none whitespace-pre-line">
        {post.content}
      </div>
      <div className="mt-12 pt-6 border-t text-center">
        <Link href="/chapters" className="btn-primary">
          Start Studying Free
        </Link>
      </div>
    </article>
  );
}
