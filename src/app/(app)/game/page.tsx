import type { Metadata } from 'next';
import { PageHeader } from '@/components/app-shell/page-header';
import { GameBoard } from '@/components/game/game-board';
import { requireUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Play Game' };

export default async function GamePage() {
  await requireUser();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tic Tac Toe"
        description="Configure your game settings and play dynamic rounds."
      />
      <GameBoard />
    </div>
  );
}
