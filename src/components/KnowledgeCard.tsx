import type { KnowledgeCard as KC } from '@/types';

export default function KnowledgeCard({ card }: { card: KC }) {
  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{card.title}</h2>
      <div className="prose prose-gray max-w-none mb-6 whitespace-pre-line">
        {card.content}
      </div>
      {card.key_points && card.key_points.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Key Points</h3>
          <ul className="space-y-1">
            {card.key_points.map((kp, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-400 mt-1">&#8226;</span>
                {kp}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-xs text-gray-400 flex flex-wrap gap-2">
        {card.source_label && (
          <span>Source: {card.source_label}</span>
        )}
        {card.updated_at && (
          <span>Updated: {new Date(card.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        )}
      </div>
    </div>
  );
}
