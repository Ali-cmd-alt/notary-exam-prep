import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import KnowledgeCard from '@/components/KnowledgeCard';
import PaywallGate from '@/components/PaywallGate';
import Link from 'next/link';
import type { KnowledgeCard as KC } from '@/types';

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapterId = parseInt(id);
  if (isNaN(chapterId)) notFound();

  const supabase = await createServerSupabase();

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single();

  if (!chapter) notFound();

  const { data: cards } = await supabase
    .from('knowledge_cards')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('sort_order');

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, sort_order')
    .order('sort_order');

  const chapterList = chapters || [];
  const currentIdx = chapterList.findIndex((c) => c.id === chapterId);
  const prev = currentIdx > 0 ? chapterList[currentIdx - 1] : null;
  const next = currentIdx < chapterList.length - 1 ? chapterList[currentIdx + 1] : null;

  // Free chapters: id 1 and 2
  const isLocked = chapterId > 2;

  // Check subscription
  const { data: { user } } = await supabase.auth.getUser();

  let hasAccess = !isLocked;
  if (user && isLocked) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    if (sub) hasAccess = true;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/chapters" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          &larr; Back to Chapters
        </Link>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
        {chapter.description && (
          <p className="text-gray-600 mt-2">{chapter.description}</p>
        )}
      </div>

      {!hasAccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          You are viewing a preview. <Link href="/pricing" className="font-semibold underline">Unlock full access</Link> to read all knowledge cards for this chapter.
        </div>
      )}

      <div className="space-y-6">
        {(cards || []).map((card, idx) => (
          <PaywallGate key={card.id} isLocked={!hasAccess && idx > 0}>
            <KnowledgeCard card={card as KC} />
          </PaywallGate>
        ))}
      </div>

      {/* Chapter Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t">
        {prev ? (
          <Link href={`/chapter/${prev.id}`} className="text-blue-600 hover:underline text-sm">
            &larr; Previous Chapter
          </Link>
        ) : <span />}
        <Link href={`/quiz/${chapterId}`} className="btn-primary text-sm">
          Take Chapter {chapter.sort_order} Quiz &rarr;
        </Link>
        {next ? (
          <Link href={`/chapter/${next.id}`} className="text-blue-600 hover:underline text-sm">
            Next Chapter &rarr;
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
