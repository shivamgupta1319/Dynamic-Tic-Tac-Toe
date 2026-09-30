import type { Metadata } from 'next';
import { PageHeader } from '@/components/app-shell/page-header';
import { GameHistoryComponent } from '@/components/game/game-history';
import { requireUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Game History' };

export default async function HistoryPage() {
  await requireUser();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Game History & Statistics"
        description="Review past completed matches, scores, and performance over time."
      />
      <GameHistoryComponent />
    </div>
  );
}
