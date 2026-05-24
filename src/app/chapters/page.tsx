import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Chapter } from '@/types';

async function getChapters() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('chapters')
    .select('*')
    .order('sort_order');
  return (data || []) as Chapter[];
}

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">California Notary Study Guide</h1>
      <p className="text-gray-600 mb-8">
        7 chapters covering everything on the California notary exam. First 2 chapters are free.
      </p>
      <div className="space-y-4">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/chapter/${ch.id}`}
            className="card block hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Chapter {ch.sort_order}
                  </span>
                  <h2 className="font-semibold text-lg">{ch.title}</h2>
                </div>
                <p className="text-sm text-gray-500">{ch.description}</p>
              </div>
              <div className="hidden md:block">
                {ch.sort_order <= 2 ? (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                    Free
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
