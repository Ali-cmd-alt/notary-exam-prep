import Link from 'next/link';

export default function PaywallGate({ children, isLocked }: { children: React.ReactNode; isLocked: boolean }) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
        <div className="text-center p-8">
          <div className="text-3xl mb-3">&#128274;</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Premium Content</h3>
          <p className="text-gray-600 text-sm mb-4">
            Unlock all 7 chapters, full question bank, practice exams, and progress tracking.
          </p>
          <Link href="/pricing" className="btn-primary text-sm">
            Unlock Full Access &mdash; $14.99
          </Link>
        </div>
      </div>
    </div>
  );
}
